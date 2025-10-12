# 02: Folders and Documents

**Purpose:** Implementation plan for workspace hierarchy, folder management, and document CRUD endpoints, including DTOs (OpenAPI-generated types) and core logic.

## Core Concepts

### Workspace Hierarchy

- **Structure:** Nested folders and documents belonging to a user
- **Root Level:** Items with `parent_id: null` or `folder_id: null` are at the root
- **Ownership:** All folders and documents are tied to a `user_id`
- **Nesting:** Folders can contain other folders and documents

### Document Storage

- **Format:** Markdown content stored as text
- **File Naming:** Documents have a `file_name` property (e.g., `My Note.md`)
- **Content Field:** Raw markdown text stored in the `content` field
- **Folder Association:** Documents can be in a folder (`folder_id`) or at root level (`null`)

## Endpoint Guide

### 3.1 Workspace Endpoints

#### `GET /workspace/hierarchy`

```ts
import type { GetWorkspaceHierarchyResponse } from "@/types";
import type { Request, Response } from "express";

async function getWorkspaceHierarchy(req: Request, res: Response): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Fetch all folders for user
	// Fetch all documents for user
	// Build nested tree structure (WorkspaceNode[])
	// Start with root-level items (parent_id/folder_id = null)
	// Recursively nest children under their parents
	// Send tree as JSON (GetWorkspaceHierarchyResponse)
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

async function createFolder(req: Request<any, any, CreateFolderRequest>, res: Response): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If parent_id provided, verify parent exists and belongs to user
	// Create folder with name, user_id, parent_id
	// Return created folder (CreateFolderResponse)
	// Send 201 Created
}
```

- **Request:** `CreateFolderRequest`
  - `name`: string (required)
  - `parent_id`: string (UUID, nullable)
- **Response:** `CreateFolderResponse` (201 Created)

#### `GET /folders/{id}`

```ts
import type { GetFolderResponse } from "@/types";
import type { Request, Response } from "express";

async function getFolderById(req: Request, res: Response): Promise<void> {
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

async function updateFolder(req: Request<any, any, UpdateFolderRequest>, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	// If parent_id provided, verify parent exists and belongs to user
	// Prevent circular references (folder cannot be its own ancestor)
	// Update name and/or parent_id
	// Return updated folder (UpdateFolderResponse)
}
```

- **Request:** `UpdateFolderRequest`
  - `name`: string (optional)
  - `parent_id`: string (UUID, nullable, optional)
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

async function createDocument(req: Request<any, any, CreateDocumentRequest>, res: Response): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If folder_id provided, verify folder exists and belongs to user
	// Create document with file_name, content, user_id, folder_id
	// Return created document (CreateDocumentResponse)
	// Send 201 Created
}
```

- **Request:** `CreateDocumentRequest`
  - `file_name`: string (required, e.g., `"My Note.md"`)
  - `content`: string (required, markdown text)
  - `folder_id`: string (UUID, nullable)
- **Response:** `CreateDocumentResponse` (201 Created)

#### `GET /documents/{id}`

```ts
import type { GetDocumentResponse } from "@/types";
import type { Request, Response } from "express";

async function getDocumentById(req: Request, res: Response): Promise<void> {
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

```ts
import type { UpdateDocumentRequest, UpdateDocumentResponse } from "@/types";
import type { Request, Response } from "express";

async function updateDocument(req: Request<any, any, UpdateDocumentRequest>, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	// If folder_id provided, verify folder exists and belongs to user
	// Update file_name, content, and/or folder_id
	// Return updated document (UpdateDocumentResponse)
}
```

- **Request:** `UpdateDocumentRequest`
  - `file_name`: string (optional)
  - `content`: string (optional, markdown text)
  - `folder_id`: string (UUID, nullable, optional)
- **Response:** `UpdateDocumentResponse` (200 OK)

#### `DELETE /documents/{id}`

```ts
import type { Request, Response } from "express";

async function deleteDocument(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	// Delete associated images (optional cleanup)
	// Delete the document
	// Send 204 No Content
}
```

- **Response:** 204 No Content
- **Cleanup:** Consider deleting associated images if needed

## Implementation Notes

### Authorization Checks

Always verify ownership before any operation:

```ts
if (folder.user_id !== req.user.id) {
	return res.status(404).json({
		error: "Not Found",
		message: "Folder not found",
	});
}
```

Use 404 instead of 403 to avoid leaking resource existence.

### Circular Reference Prevention

When updating folder's `parent_id`:

```ts
// Check if new parent is a descendant of current folder
async function isDescendant(folderId: string, ancestorId: string): Promise<boolean> {
	// Traverse up the tree from folderId
	// If we reach ancestorId, it's a descendant
	// Return true to prevent circular reference
}
```

### Cascading Deletes

When deleting a folder:

1. Find all descendant folders recursively
2. Find all documents in folder and descendants
3. Delete all documents
4. Delete all folders (bottom-up)
5. Delete the target folder

### [TODO] Building Hierarchy Tree

Algorithm for `GET /workspace/hierarchy`:

```ts
// 1. Fetch all folders and documents for user
// 2. Create maps: folders by id, documents by folder_id
// 3. Build tree starting with root items (parent_id/folder_id = null)
// 4. For each folder, recursively attach children
// 5. Return root-level nodes as array
```
