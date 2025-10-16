# Database Design

## Current Models

1. **User**

```ts
interface User {
	_id: ObjectId;
	displayName: string;
	email: string;
	avatarUrl: string;
	hashedPassword: string;
	refreshToken: string | null;
	createdAt: Date;
	updatedAt: Date;
}
```

2. **Document**

```ts
interface Document {
	_id: ObjectId;
	userId: ObjectId; // references User._id
	folderId: ObjectId; // references Folder._id
	fileName: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}
```

3. **Image**

```ts
interface Image {
	_id: ObjectId;
	userId: ObjectId; // references User._id
	documentId: ObjectId; // references Document._id
	folderId: ObjectId; // references Folder._id
	storageUrl: string;
	fileName: string;
	mimeType: string;
	pendingDelete: boolean; // Default: false
	markedForDeleteAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}
```

4. **Folder**

```ts
interface Folder {
	_id: ObjectId;
	userId: ObjectId; // references User._id
	parentId?: ObjectId; // reference to another Folder (optional)
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
```

### Note

- ObjectId fields must be connected by reference. References are defined as:

```ts
{ type: Schema.Types.ObjectId, ref: "User" }
```

where `ref` points to the Mongoose model name.

## Schema Methods

### User

- The User schema includes a pre-save hook that listens for changes to the `hashedPassword` field. If changes are detected, it always hashes the password before storing it.
- The User schema provides a `comparePassword` method to check the current user's `hashedPassword` against a provided string.

**Code Snippets:**

```ts
// methods
userSchema.methods.comparePassword = function (candidate: string) {
    // return compare(candidate, this.hashedPassword);
};

// pre-save hook
userSchema.pre("save", async function () {
    if (!this.isModified("hashedPassword")) return;

    this.hashedPassword = // implementation
    // only call next() for sync hook
});

export const User = model("User", userSchema);
```

# Pipelines

## Get Workspace Hierarchy

### Output Interface

```ts
interface WorkspaceNode {
	id: string;
	name: string;
	type: "folder" | "file";
	children?: WorkspaceNode[];
}
```

### Algorithm

#### Part 1: MongoDB Aggregation (Get Flat Data)

1. **Start with the Folders collection**, filtering by `userId`.
2. **Transform** each folder document to a flat node format:
   - `id`: convert `_id` to string
   - `name`: keep as-is
   - `type`: set as `"folder"`
   - `parentId`: convert to string (null if root)
3. **Union with the Documents collection**:
   - Filter by `userId`
   - Transform: `id` from `_id`, `name` from `fileName`, `type` = `"file"`, `parentId` from `folderId`
4. **Union with the Images collection**:
   - Filter by `userId`
   - Transform: `id` from `_id`, `name` from `fileName`, `type` = `"file"`, `parentId` from `folderId`
5. **Return** a flat array of all nodes with `parentId` references.

#### Part 2: Node.js Nesting (Build Tree)

1. Define a **recursive function** called `buildTree`.
2. The function takes two arguments:
   - `parentId`: the ID of the current folder whose children are to be found
   - `items`: the flat array of all nodes from MongoDB
3. **Filter** the `items` array to find all elements whose `parentId` matches the current `parentId`.
4. For each matched item:
   - Create a node with `id`, `name`, and `type`
   - If the item is a folder, **recursively call** `buildTree` with the folder's `id` as the new `parentId` and assign the result to the node's `children`
   - If the item is a file, leave `children` undefined
5. Return the array of nodes found for the current `parentId`.
6. Call `buildTree` initially with `parentId = null` to construct the full hierarchy.

**Snippet:**

```ts
function buildTree(parentId: string | null, items: WorkspaceNode[]): WorkspaceNode[] {
	return items
		.filter((item) => parentId === item.parentId)
		.map((item) => ({
			id: item.id,
			name: item.name,
			type: item.type,
			children: item.type === "folder" ? buildTree(item.id, items) : undefined,
		}));
}
```

### MongoDB Operators Used

- **`$match`**: Filters documents by `userId`
- **`$project`**: Transforms fields to a uniform format
- **`$unionWith`**: Combines results from multiple collections (folders, documents, images) into a single array

# Algorithm: Image Cleanup System

## Utility Functions

### 1. Extract Image References

```ts
function extractImageReferences(content: string): string[];
```

**Purpose**: Parse document content and extract all image fileNames/URLs.

**Algorithm**:

1. Define a regex pattern for image syntax (to be determined during implementation).
2. Use `content.matchAll(regex)` to find all image references.
3. Extract the fileName or URL from each match.
4. Return an array of unique image references.

### 2. Mark Images for Deletion

```ts
async function markImagesForDeletion(documentId: string, oldContent: string, newContent: string): Promise<number>;
```

**Purpose**: Detect deleted images by comparing old vs. new content.

**Algorithm**:

1. Extract image references from `oldContent` using `extractImageReferences()`.
2. Extract image references from `newContent` using `extractImageReferences()`.
3. Find deleted images: `deletedImages = oldContent images NOT in newContent images`.
4. Query the Images collection where `documentId` matches AND `fileName` is in the `deletedImages` array.
5. Update matched images: set `pendingDelete: true` and `markedForDeleteAt: new Date()`.
6. Return the count of images marked.

### 3. Mark All Document Images for Deletion

```ts
async function markAllDocumentImagesForDeletion(documentId: string): Promise<number>;
```

**Purpose**: Mark all images in a document when the document is deleted.

**Algorithm**:

1. Query the Images collection where `documentId` matches.
2. Update all matched images: set `pendingDelete: true` and `markedForDeleteAt: new Date()`.
3. Return the count of images marked.

## Background Cleanup Job (Cron)

### Cleanup Expired Images

```ts
async function cleanupExpiredImages(graceHours: number = 48);
```

**Purpose**: Permanently delete images past the grace period.

**Schedule**: Runs every 6 hours via a cron job.

**Algorithm**:

1. Calculate the cutoff date: `cutoffDate = currentDate - graceHours`.
2. Query the Images collection where:
   - `pendingDelete === true`
   - `markedForDeleteAt <= cutoffDate`
3. For each image found:
   - Extract `publicId` from `storageUrl` (Cloudinary identifier).
   - Call the Cloudinary API to delete the image: `await cloudinary.uploader.destroy(publicId)`.
   - If Cloudinary deletion succeeds:
     - Delete the image document from the database.
   - If Cloudinary deletion fails:
     - Log the error for monitoring.
     - Skip database deletion (will retry in the next run).
4. Return an object with counts: `{ deleted: number, failed: number }`.
5. Log results for monitoring.

**Cron Setup**:

```ts
cron.schedule("0 */6 * * *", async () => {
	await cleanupExpiredImages(48);
});
```
