# 03: Image Uploads

**Purpose:** Implementation plan for image upload functionality, including validation, storage on Cloudinary, and REST endpoints for creating, retrieving, and deleting images. Assumes an Express.js application with user authentication and a NoSQL database schema.

## Core Concepts

### Image Uploads

- **Multer:** Middleware to parse `multipart/form-data`. Memory storage is used to stream the buffer directly to Cloudinary.
- **Cloudinary:** Remote image hosting and CDN. Images are uploaded via `cloudinary.uploader.upload_stream` to avoid writing to disk.
- **Authentication:** Requests must be authenticated. Assumes an existing JWT cookie/session system.
- **Image Metadata:** Metadata is stored in a MongoDB with fields for user ID, document ID, folder ID, storage URL, filename, MIME type, and deletion status.

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

```ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

This ensures that Cloudinary is properly set up to handle image uploads and other operations. Make sure to replace `<your_api_secret>` with your actual Cloudinary API secret in the `.env` file.

## Endpoint Guide

### 3.1 Image Endpoints

#### `POST /images`

```ts
import type { CreateImageRequest, CreateImageResponse } from "@/types";
import type { Request, Response } from "express";

async function createImage(req: Request<any, any, CreateImageRequest>, res: Response): Promise<void> {
  // Get userId from req.user (auth middleware)
  // Validate input (Multer middleware)
  // Validate MIME type against ALLOWED_IMAGE_MIMETYPES
  // Upload image to Cloudinary
  // Save metadata to database
  // Return created image record (CreateImageResponse)
  // Send 201 Created
}
```

- **Request:** `CreateImageRequest`
  - `file`: File (required, `multipart/form-data` field)
  - `document_id`: UUID (optional, associates image with a document)
- **Response:** `CreateImageResponse` (201 Created)
  - `_id`: ObjectId
  - `userId`: ObjectId
  - `documentId`: ObjectId
  - `folderId`: ObjectId
  - `storageUrl`: string
  - `filename`: string
  - `mimeType`: string
  - `pendingDelete`: boolean
  - `markedForDeleteAt`: Date | null
  - `createdAt`: Date
  - `updatedAt`: Date
- **Errors:** `400` (missing file), `401` (unauthorized), `415` (unsupported media type), `500` (server error).

#### `GET /images/{id}`

```ts
import type { GetImageResponse } from "@/types";
import type { Request, Response } from "express";

async function getImage(req: Request, res: Response): Promise<void> {
  // Extract image ID from req.params.id
  // Fetch image metadata from database
  // Return image metadata (GetImageResponse)
  // Send 404 if not found
}
```

- **Response:** `GetImageResponse` (200 OK)
  - `_id`: ObjectId
  - `userId`: ObjectId
  - `documentId`: ObjectId
  - `folderId`: ObjectId
  - `storageUrl`: string
  - `filename`: string
  - `mimeType`: string
  - `pendingDelete`: boolean
  - `markedForDeleteAt`: Date | null
  - `createdAt`: Date
  - `updatedAt`: Date
- **Errors:** `404` (not found).

#### `DELETE /images/{id}`

```ts
import type { Request, Response } from "express";

async function deleteImage(req: Request, res: Response): Promise<void> {
  // Extract image ID from req.params.id
  // Fetch image metadata from database
  // Verify ownership or admin privileges
  // Delete image from Cloudinary
  // Mark image as pending delete in database
  // Send 204 No Content
}
```

- **Response:** `204 No Content`
- **Errors:** `401` (unauthorized), `403` (forbidden), `404` (not found), `500` (server error).

## Implementation Notes

### Authorization Checks

Always verify ownership before any operation:

```ts
if (image.userId.toString() !== req.user._id.toString()) {
  return res.status(404).json({
    error: "Not Found",
    message: "Image not found",
  });
}
```

Use `404` instead of `403` to avoid leaking resource existence.

### Cascading Deletes

When deleting an image, ensure both the Cloudinary resource and the database record are removed. Handle errors gracefully to avoid partial deletions.

