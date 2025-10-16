Of course. I have regenerated all the documentation files with the necessary corrections to align them perfectly with your latest API contract and generated types. All `snake_case` references have been updated to `camelCase`, function signatures now include the correct response types, and type imports have been fixed.

Here are the complete, updated files:

---

### START OF FILE `00-Core-Architecture-and-Setup.md`

---

---

### END OF FILE `01-Authentication-and-Users.md`

---

## <br>

### START OF FILE `02-Workspace-and-Files.md`

---

# 02: Folders and Documents

**Purpose:** Implementation plan for workspace hierarchy, folder management, and document CRUD endpoints, including DTOs (OpenAPI-generated types) and core logic.

## Core Concepts

### Workspace Hierarchy

- **Structure:** Nested folders and documents belonging to a user
- **Root Level:** Items with `parentId: null` or `folderId: null` are at the root
- **Ownership:** All folders and documents are tied to a `userId`
- **Nesting:** Folders can contain other folders and documents

### Document Storage

- **Format:** Markdown content stored as text
- **File Naming:** Documents have a `fileName` property (e.g., `My Note.md`)
- **Content Field:** Raw markdown text stored in the `content` field
- **Folder Association:** Documents can be in a folder (`folderId`) or at root level (`null`)

## Endpoint Guide

### 3.1 Workspace Endpoints

#### `GET /workspace/hierarchy`

```ts
import type { GetWorkspaceHierarchyResponse } from "@/types";
import type { Request, Response } from "express";

async function getWorkspaceHierarchy(req: Request, res: Response<GetWorkspaceHierarchyResponse>): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Fetch all folders for user
	// Fetch all documents for user
	// Build nested tree structure (WorkspaceNode[])
	// Start with root-level items (parentId/folderId = null)
	// Recursively nest children under their parents
	// Send tree as JSON (GetWorkspaceHierarchyResponse)
	// See 04-DataBase-Design.md for full algorithm implementation
}
```

- **Response:** `GetWorkspaceHierarchyResponse` (array of `WorkspaceNode`)
- **Structure:** Each `WorkspaceNode` has:
  - `id`: UUID
  - `name`: Display name
  - `type`: `"folder"` or `"document"`
  - `children`: Array of nested `WorkspaceNode` (only for folders)

### 3.2 Folder Management

#### `POST /folders`

```ts
import type { CreateFolderRequest, CreateFolderResponse } from "@/types";
import type { Request, Response } from "express";

async function createFolder(
	req: Request<any, any, CreateFolderRequest>,
	res: Response<CreateFolderResponse>
): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If parentId provided, verify parent exists and belongs to user
	// Create folder with name, userId, parentId
	// Return created folder (CreateFolderResponse)
	// Send 201 Created
}
```

- **Request:** `CreateFolderRequest`
  - `name`: string (required)
  - `parentId`: string (UUID, nullable)
- **Response:** `CreateFolderResponse` (201 Created)

#### `GET /folders/{id}`

```ts
import type { GetFolderResponse } from "@/types";
import type { Request, Response } from "express";

async function getFolderById(req: Request, res: Response<GetFolderResponse>): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	// Return folder details (GetFolderResponse)
	// Send 404 if not found or doesn't belong to user
}
```

- **Response:** `GetFolderResponse` (200 OK)
- **Errors:** 404 if folder not found or unauthorized

#### `PATCH /folders/{id}`

```ts
import type { UpdateFolderRequest, UpdateFolderResponse } from "@/types";
import type { Request, Response } from "express";

async function updateFolder(
	req: Request<any, any, UpdateFolderRequest>,
	res: Response<UpdateFolderResponse>
): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	// If parentId provided, verify parent exists and belongs to user
	// Prevent circular references (folder cannot be its own ancestor)
	// Update name and/or parentId
	// Return updated folder (UpdateFolderResponse)
}
```

- **Request:** `UpdateFolderRequest`
  - `name`: string (optional)
  - `parentId`: string (UUID, nullable, optional)
- **Response:** `UpdateFolderResponse` (200 OK)
- **Validation:** Prevent moving folder into itself or its descendants

#### `DELETE /folders/{id}`

```ts
import type { Request, Response } from "express";

async function deleteFolder(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	// Delete all nested folders and documents (cascade delete)
	// Delete the folder itself
	// Send 204 No Content
}
```

- **Response:** 204 No Content
- **Behavior:** Cascading delete - removes all nested folders and documents

### 3.3 Document Management

#### `POST /documents`

```ts
import type { CreateDocumentRequest, CreateDocumentResponse } from "@/types";
import type { Request, Response } from "express";

async function createDocument(
	req: Request<any, any, CreateDocumentRequest>,
	res: Response<CreateDocumentResponse>
): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If folderId provided, verify folder exists and belongs to user
	// Create document with fileName, content, userId, folderId
	// Return created document (CreateDocumentResponse)
	// Send 201 Created
}
```

- **Request:** `CreateDocumentRequest`
  - `fileName`: string (required, e.g., `"My Note.md"`)
  - `content`: string (required, markdown text)
  - `folderId`: string (UUID, nullable)
- **Response:** `CreateDocumentResponse` (201 Created)

#### `GET /documents/{id}`

```ts
import type { GetDocumentResponse } from "@/types";
import type { Request, Response } from "express";

async function getDocumentById(req: Request, res: Response<GetDocumentResponse>): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	// Return document details (GetDocumentResponse)
	// Send 404 if not found or doesn't belong to user
}
```

- **Response:** `GetDocumentResponse` (200 OK)
- **Errors:** 404 if document not found or unauthorized

#### `PATCH /documents/{id}`

````ts
import type { UpdateDocumentRequest, UpdateDocumentResponse } from "@/types";
import type { Request, Response } from "express";

async function updateDocument(req: Request<any, any, UpdateDocumentRequest>, res: Response<UpdateDocumentResponse>): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	// Store old content: oldContent = document.content
	// If folderId provided, verify folder exists and belongs to user
	// Update fileName, content, and/or folderId
	// Save document to database
	// Return updated document (UpdateDocumentResponse)
	// AFTER response sent: Fire-and-forget call to markImagesForDeletion(documentId, oldContent, newContent)
	// See 04-DataBase-Design.md - Image Cleanup System for implementation details
}```

- **Request:** `UpdateDocumentRequest`
  - `fileName`: string (optional)
  - `content`: string (optional, markdown text)
  - `folderId`: string (UUID, nullable, optional)
- **Response:** `UpdateDocumentResponse` (200 OK)
- **Image Cleanup:** Asynchronously detects and marks deleted images after response

#### `DELETE /documents/{id}`

```ts
import type { Request, Response } from "express";

async function deleteDocument(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	// Delete the document
	// Send 204 No Content
	// AFTER response sent: Fire-and-forget call to markAllDocumentImagesForDeletion(documentId)
	// See 04-DataBase-Design.md - Image Cleanup System for implementation details
}
````

- **Response:** 204 No Content
- **Image Cleanup:** Asynchronously marks all associated images for deletion after response

## Implementation Notes

### Authorization Checks

Always verify ownership before any operation:

````ts
if (folder.userId !== req.user.id) {
	return res.status(404).json({
		error: "Not Found",
		message: "Folder not found",
	});
}```

Use 404 instead of 403 to avoid leaking resource existence.

### Circular Reference Prevention

When updating folder's `parentId`:

```ts
// Check if new parent is a descendant of current folder
async function isDescendant(folderId: string, ancestorId: string): Promise<boolean> {
	// Traverse up the tree from folderId
	// If we reach ancestorId, it's a descendant
	// Return true to prevent circular reference
}
````

### Cascading Deletes

When deleting a folder:

1. Find all descendant folders recursively
2. Find all documents in folder and descendants
3. Delete all documents
4. Delete all folders (bottom-up)
5. Delete the target folder

### Building Hierarchy Tree

See **04-DataBase-Design.md** for the complete algorithm implementation using MongoDB aggregation pipeline and JavaScript tree building.

---

### END OF FILE `02-Workspace-and-Files.md`

---

## <br>

### START OF FILE `03-Image-Uploads.md`

---

# 03: Image Uploads

**Purpose:** Implementation plan for image upload functionality, including validation, storage on Cloudinary, and REST endpoints for creating, retrieving, and deleting images.

## Core Concepts

### Image Uploads

- **Multer:** Middleware to parse `multipart/form-data`. Memory storage is used to stream the buffer directly to Cloudinary.
- **Cloudinary:** Remote image hosting and CDN. Images are uploaded via `cloudinary.uploader.upload_stream` to avoid writing to disk.
- **Authentication:** Requests must be authenticated. With the existing JWT cookie system.
- **Image Metadata:** Metadata is stored in a MongoDB as per the [Image Model](./04-DataBase-Design.md).

### Validation

- **File Size:** Maximum file size is defined by `MAX_IMAGE_FILE_SIZE` (default: 5 MB).
- **MIME Types:** Allowed MIME types are defined by `ALLOWED_IMAGE_MIMETYPES` (e.g., `image/jpeg`, `image/png`, `image/webp`).

## Setup

### Necessary Environment Variables

To configure Cloudinary, the following environment variables must be set in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=dimkhk6sn
CLOUDINARY_API_KEY=528247535147883
CLOUDINARY_API_SECRET=<your_api_secret>
```

### Using the Environment Variables

In your application, configure Cloudinary using the `cloudinary.config` method:

````ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});```

This ensures that Cloudinary is properly set up to handle image uploads and other operations. Make sure to replace `<your_api_secret>` with your actual Cloudinary API secret in the `.env` file.

## Libraries

### Multer

Multer is a middleware for handling `multipart/form-data`, primarily used for uploading files. In this project, we use Multer with memory storage to avoid writing files to disk. Instead, the file buffer is directly passed to Cloudinary for upload.

#### Example Usage:

```ts
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle single file upload
const singleImage = upload.single("file");

export { singleImage };
````

### Cloudinary

Cloudinary is a cloud-based service for image hosting and transformations. It provides a simple API to upload, manage, and deliver images efficiently.

#### Example Usage:

```ts
import { v2 as cloudinary } from "cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image buffer to Cloudinary
async function uploadBufferToCloudinary(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
		stream.end(buffer);
	});
}

export { uploadBufferToCloudinary };
```

### Utility Functions

Utility functions are used to streamline repetitive tasks, such as validating MIME types or generating unique folder paths for uploads.

#### Example: MIME Type Validation

```ts
function validateMimeType(mimeType: string, allowedTypes: string[]): boolean {
	return allowedTypes.includes(mimeType);
}

export { validateMimeType };
```

## Endpoint Guide

### 3.1 Image Endpoints

#### `POST /images`

```ts
import type { UploadImageRequest, UploadImageResponse } from "@/types";
import type { Request, Response } from "express";

async function createImage(
	req: Request<any, any, UploadImageRequest>,
	res: Response<UploadImageResponse>
): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Validate input (Multer middleware)
	// Validate MIME type against ALLOWED_IMAGE_MIMETYPES
	// Upload image to Cloudinary
	// Save metadata to database
	// Return created image record (UploadImageResponse)
	// Send 201 Created
}
```

- **Request:** `UploadImageRequest`
  - `file`: File (required, `multipart/form-data` field)
  - `documentId`: UUID (optional, associates image with a document)
  - `folderId`: UUID (optional, associates image with a folder)
- **Response:** `UploadImageResponse` (201 Created)
- **Errors:** 400 (missing file), 401 (unauthorized), 415 (unsupported media type), 500 (server error)

#### `GET /images/{id}`

```ts
import type { GetImageResponse } from "@/types";
import type { Request, Response } from "express";

async function getImage(req: Request, res: Response<GetImageResponse>): Promise<void> {
	// Extract image ID from req.params.id
	// Fetch image metadata from database
	// Return image metadata (GetImageResponse)
	// Send 404 if not found
}
```

- **Response:** `GetImageResponse` (200 OK)
- **Errors:** 404 (not found)

### Cascading Deletes

When deleting an image, ensure both the Cloudinary resource and the database record are removed. Handle errors gracefully to avoid partial deletions.

---

### END OF FILE `03-Image-Uploads.md`

---

## <br>

### START OF FILE `04-DataBase-Design.md`

---

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
	filename: string;
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
   - Transform: `id` from `_id`, `name` from `filename`, `type` = `"file"`, `parentId` from `folderId`
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

**Purpose**: Parse document content and extract all image filenames/URLs.

**Algorithm**:

1. Define a regex pattern for image syntax (to be determined during implementation).
2. Use `content.matchAll(regex)` to find all image references.
3. Extract the filename or URL from each match.
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
4. Query the Images collection where `documentId` matches AND `filename` is in the `deletedImages` array.
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

---

### END OF FILE `04-DataBase-Design.md`

---
