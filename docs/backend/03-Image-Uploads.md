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

```ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

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
```

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
