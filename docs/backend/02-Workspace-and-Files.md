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
import { ApiResponse } from "@/utils/ApiResponse";

async function getWorkspaceHierarchy(
	req: Request,
	res: Response<ApiResponse<GetWorkspaceHierarchyResponse>>
): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Fetch all folders for user
	// Fetch all documents for user
	// Build nested tree structure (WorkspaceNode[])
	// Start with root-level items (parentId/folderId = null)
	// Recursively nest children under their parents
	// Return workspace hierarchy using ApiResponse<GetWorkspaceHierarchyResponse>
	res
		.status(200)
		.json(new ApiResponse<GetWorkspaceHierarchyResponse>(200, hierarchy, "Workspace hierarchy retrieved successfully"));
	// See 04-DataBase-Design.md for full algorithm implementation
}
```

- **Response:** `ApiResponse<GetWorkspaceHierarchyResponse>` (array of `WorkspaceNode`)
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
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError } from "@/utils/errors";

async function createFolder(
	req: Request<any, any, CreateFolderRequest>,
	res: Response<ApiResponse<CreateFolderResponse>>
): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If parentId provided, verify parent exists and belongs to user
	if (parentId && !parentFolder) throw new NotFoundError("Parent folder not found");
	// Create folder with name, userId, parentId
	// Return created folder using ApiResponse<CreateFolderResponse>
	res.status(201).json(new ApiResponse<CreateFolderResponse>(201, newFolder, "Folder created successfully"));
}
```

- **Request:** `CreateFolderRequest`
  - `name`: string (required)
  - `parentId`: string (UUID, nullable)
- **Response:** `ApiResponse<CreateFolderResponse>` (201 Created)

#### `GET /folders/{id}`

```ts
import type { GetFolderResponse } from "@/types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError } from "@/utils/errors";

async function getFolderById(req: Request, res: Response<ApiResponse<GetFolderResponse>>): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	if (!folder || folder.userId.toString() !== req.user.id) throw new NotFoundError("Folder not found");
	// Return folder details using ApiResponse<GetFolderResponse>
	res.status(200).json(new ApiResponse<GetFolderResponse>(200, folder, "Folder retrieved successfully"));
}
```

- **Response:** `ApiResponse<GetFolderResponse>` (200 OK)
- **Errors:** Throw `NotFoundError` if folder not found or unauthorized

#### `PATCH /folders/{id}`

```ts
import type { UpdateFolderRequest, UpdateFolderResponse } from "@/types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError, BadRequestError } from "@/utils/errors";

async function updateFolder(
	req: Request<any, any, UpdateFolderRequest>,
	res: Response<ApiResponse<UpdateFolderResponse>>
): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	if (!folder || folder.userId.toString() !== req.user.id) throw new NotFoundError("Folder not found");
	// If parentId provided, verify parent exists and belongs to user
	if (parentId && !parentFolder) throw new NotFoundError("Parent folder not found");
	// Prevent circular references (folder cannot be its own ancestor)
	if (isCircular) throw new BadRequestError("A folder cannot be moved into itself or one of its descendants.");
	// Update name and/or parentId
	// Return updated folder using ApiResponse<UpdateFolderResponse>
	res.status(200).json(new ApiResponse<UpdateFolderResponse>(200, updatedFolder, "Folder updated successfully"));
}
```

- **Request:** `UpdateFolderRequest`
  - `name`: string (optional)
  - `parentId`: string (UUID, nullable, optional)
- **Response:** `ApiResponse<UpdateFolderResponse>` (200 OK)
- **Validation:** Prevent moving folder into itself or its descendants

#### `DELETE /folders/{id}`

```ts
import type { Request, Response } from "express";
import { NotFoundError } from "@/utils/errors";

async function deleteFolder(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract folder id from req.params.id
	// Fetch folder by id
	// Verify folder belongs to user
	if (!folder || folder.userId.toString() !== req.user.id) throw new NotFoundError("Folder not found");
	// Delete all nested folders and documents (cascade delete)
	// Delete the folder itself
	// Send 204 No Content
	res.status(204).send();
}
```

- **Response:** 204 No Content
- **Behavior:** Cascading delete - removes all nested folders and documents

### 3.3 Document Management

#### `POST /documents`

```ts
import type { CreateDocumentRequest, CreateDocumentResponse } from "@/types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError } from "@/utils/errors";

async function createDocument(
	req: Request<any, any, CreateDocumentRequest>,
	res: Response<ApiResponse<CreateDocumentResponse>>
): Promise<void> {
	// Get userId from req.user
	// Validate input (OpenAPI middleware)
	// If folderId provided, verify folder exists and belongs to user
	if (folderId && !folder) throw new NotFoundError("Folder not found");
	// Create document with fileName, content, userId, folderId
	// Return created document using ApiResponse<CreateDocumentResponse>
	res.status(201).json(new ApiResponse<CreateDocumentResponse>(201, newDocument, "Document created successfully"));
}
```

- **Request:** `CreateDocumentRequest`
  - `fileName`: string (required, e.g., `"My Note.md"`)
  - `content`: string (required, markdown text)
  - `folderId`: string (UUID, nullable)
- **Response:** `ApiResponse<CreateDocumentResponse>` (201 Created)

#### `GET /documents/{id}`

```ts
import type { GetDocumentResponse } from "@/types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError } from "@/utils/errors";

async function getDocumentById(req: Request, res: Response<ApiResponse<GetDocumentResponse>>): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	if (!document || document.userId.toString() !== req.user.id) throw new NotFoundError("Document not found");
	// Return document details using ApiResponse<GetDocumentResponse>
	res.status(200).json(new ApiResponse<GetDocumentResponse>(200, document, "Document retrieved successfully"));
}
```

- **Response:** `ApiResponse<GetDocumentResponse>` (200 OK)
- **Errors:** Throw `NotFoundError` if document not found or unauthorized

#### `PATCH /documents/{id}`

```ts
import type { UpdateDocumentRequest, UpdateDocumentResponse } from "@/types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { NotFoundError } from "@/utils/errors";

async function updateDocument(
	req: Request<any, any, UpdateDocumentRequest>,
	res: Response<ApiResponse<UpdateDocumentResponse>>
): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	if (!document || document.userId.toString() !== req.user.id) throw new NotFoundError("Document not found");
	// Store old content: oldContent = document.content
	// If folderId provided, verify folder exists and belongs to user
	if (folderId && !folder) throw new NotFoundError("Folder not found");
	// Update fileName, content, and/or folderId
	// Save document to database
	// Return updated document using ApiResponse<UpdateDocumentResponse>
	res.status(200).json(new ApiResponse<UpdateDocumentResponse>(200, updatedDocument, "Document updated successfully"));
	// AFTER response sent: Fire-and-forget call to markImagesForDeletion(documentId, oldContent, newContent)
	// See 04-DataBase-Design.md - Image Cleanup System for implementation details
}
```

- **Request:** `UpdateDocumentRequest`
  - `fileName`: string (optional)
  - `content`: string (optional, markdown text)
  - `folderId`: string (UUID, nullable, optional)
- **Response:** `ApiResponse<UpdateDocumentResponse>` (200 OK)
- **Image Cleanup:** Asynchronously detects and marks deleted images after response

#### `DELETE /documents/{id}`

```ts
import type { Request, Response } from "express";
import { NotFoundError } from "@/utils/errors";

async function deleteDocument(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Extract document id from req.params.id
	// Fetch document by id
	// Verify document belongs to user
	if (!document || document.userId.toString() !== req.user.id) throw new NotFoundError("Document not found");
	// Delete the document
	// Send 204 No Content
	res.status(204).send();
	// AFTER response sent: Fire-and-forget call to markAllDocumentImagesForDeletion(documentId)
	// See 04-DataBase-Design.md - Image Cleanup System for implementation details
}
```

- **Response:** 204 No Content
- **Image Cleanup:** Asynchronously marks all associated images for deletion after response

## Implementation Notes

### Authorization Checks

Always verify ownership before any operation:

```ts
import { NotFoundError } from "@/utils/errors";

if (folder.userId.toString() !== req.user.id) {
	throw new NotFoundError("Folder not found");
}
```

Use `NotFoundError` instead of `ForbiddenError` to avoid leaking resource existence.

### Circular Reference Prevention

When updating folder's `parentId`:

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

### Building Hierarchy Tree

See **04-DataBase-Design.md** for the complete algorithm implementation using MongoDB aggregation pipeline and JavaScript tree building.
