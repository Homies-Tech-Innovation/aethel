# 00: Core Architecture and Setup

**Purpose:** This document defines the foundational technology stack, project structure, core patterns, and development environment for the Aethel application. All developers must follow these standards to ensure consistency and maintainability.

## 1. Technology Stack

The following tools are required for the project. Any changes must be formally approved.

- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **API Validation:** `express-openapi-validator` (enforces OpenAPI contract at middleware level)
- **Containerization:** Docker

## 2. Monorepo and Project Structure

The project uses a monorepo with multiple services. This guide focuses on the main `aethel-backend` service.

```
backend/
├── aethel-backend/
│   ├── src/
│   │   ├── config/         # Environment variables and app config
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Custom Express middlewares
│   │   ├── models/         # Mongoose models and schemas
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic and API integrations
│   │   ├── types/          # Shared/generated TypeScript types
│   │   ├── utils/          # Utility functions and helpers
│   │   └── index.ts        # Application entry point
│   ├── .env                # Local environment variables (git-ignored)
│   ├── .env.example        # Example environment variables
│   └── package.json        # Dependencies and scripts
├── .env.docker             # Docker Compose DB config (git-ignored)
├── .env.docker.example     # Example for .env.docker
└── docker-compose.yml      # Spins up the database container only
```

## 3. Development Environment and Docker

Docker Compose is used **only** to run the MongoDB database. The backend service must be run locally for development to enable debugging and hot-reloading.

See the [Docker Guide](../../backend/docker-guide.md) for details.

> **Note:** This setup is intentionally restrictive for simplicity. If running the backend in Docker becomes necessary (e.g., for CI or testing), this guide will be updated.

## 4. Reusable API Components and Error Handling

To keep our codebase clean, predictable, and DRY (Don't Repeat Yourself), we'll implement a standardized pattern for handling all API responses and errors. This involves a set of reusable utility classes and middleware.

### The `ApiResponse` Class

For all successful responses, we'll use a consistent structure. The `ApiResponse` class wraps our data payload, ensuring that the frontend always receives a predictable JSON object. We're using generics (`<T>`) so we get full TypeScript support from our OpenAPI-generated types, which makes our controllers strongly typed and less error-prone.

**Location:** `src/utils/ApiResponse.ts`

```ts
class ApiResponse<T> {
	public statusCode: number;
	public data: T;
	public message: string;
	public success: boolean;

	constructor(statusCode: number, data: T, message = "Success") {
		this.statusCode = statusCode;
		this.data = data;
		this.message = message;
		this.success = true;
	}
}

export { ApiResponse };
```

**Usage in controllers:**

```ts
// Send a success response with a typed data payload
return res.status(200).json(new ApiResponse<GetCurrentUserResponse>(200, user, "User retrieved successfully"));
```

### Error Classes

Controllers and services should throw subclasses of `ApiError` (or `ApiError` itself) for expected failures; the error handler will use its properties for logging and client responses while preserving the original stack for debugging.

**Directory structure:** `src/utils/errors/`

#### `ApiError` (base class) - `ApiError.ts`

```ts
export class ApiError extends Error {
	public statusCode: number;
	public success: boolean;
	public errors: string[];

	constructor(statusCode: number, message?: string, errors?: string[]);
}
```

#### Special Error Classes - `SpecialErrors.ts`

```ts
import { ApiError } from "@/utils/errors/ApiError";

export class BadRequestError extends ApiError {
	/* 400 */
}
export class UnauthorizedError extends ApiError {
	/* 401 */
}
export class ForbiddenError extends ApiError {
	/* 403 */
}
export class NotFoundError extends ApiError {
	/* 404 */
}
export class ConflictError extends ApiError {
	/* 409 */
}
```

**Usage in controllers:**

```ts
import { NotFoundError, ConflictError } from "@/utils/errors";

if (!user) throw new NotFoundError("User not found");
if (existingUser) throw new ConflictError("A user with this email already exists.");
```

### The `asyncHandler` Utility

To avoid littering our controllers with repetitive `try...catch` blocks for asynchronous operations, we'll use a simple higher-order function. The `asyncHandler` wraps our async route handlers, catches any rejected promises (errors), and automatically passes them to our global error handler.

**Location:** `src/utils/asyncHandler.ts`

```ts
import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
```

**Usage in routes:**

```ts
// We just wrap the controller function when defining the route.
router.get("/users/me", authenticate, asyncHandler(getCurrentUser));
router.post("/register", asyncHandler(registerUser));
```

### Global Error Handler

This is our application's final safety net. We'll create a single error-handling middleware that catches all errors—whether they're an `ApiError` we threw, a validation error from `express-openapi-validator`, or an unexpected system error. Its job is to format the error into the consistent JSON response that matches our OpenAPI `Error` schema.

**Location:** `src/middlewares/errorHandler.middleware.ts`

```ts
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
	// Log error for debugging
	// Determine status code and message
	// If ApiError: use err.statusCode and err.message
	// Otherwise: default to 500 and generic message
	// Format response matching Error schema from OpenAPI
	// Send a JSON response to client
}
```

**Integration:** This middleware must be registered **last** in our `index.ts`, after all other `app.use()` calls and routes. This ensures it catches errors from everything that came before it.

## 5. Logging

- **Library:** Pino.js for structured, high-performance logging.
- **Log Levels:** Controlled by the `LOG_LEVEL` environment variable.
  - `info`: Log all HTTP requests and responses.
  - `error`: Log uncaught exceptions and operational errors.
  - `debug`: Log key steps in service logic (should be disabled in production).

## 6. Router Organization

**Separation of Concerns:**

- Each resource (auth, users, folders, documents, images) gets its own route file
- Route files handle path definitions and middleware application
- Controllers handle business logic

**Structure:**

```text
routes/
├── auth.routes.ts      # /auth/_ endpoints
├── users.routes.ts     # /users/_ endpoints
├── folders.routes.ts   # /folders/_ endpoints
├── documents.routes.ts # /documents/_ endpoints
└── images.routes.ts    # /images/_ endpoints
```

**Route File Pattern:**
Each route file exports a Router instance with all paths for that resource.

**Example Template:**

```ts
// routes/example.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Public route
router.get("/", sampleController);

// Protected route
router.post("/", authenticate, sampleController);

export default router;
```

**Main App Integration:**

```ts
import authRoutes from "@/routes/auth.routes";
import usersRoutes from "@/routes/users.routes";
// ... other routes

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
// ... other mounts
```

**Middleware Application:**

- Apply `authenticate` middleware per-route on protection needs
- Public routes (register, login) don't need authentication
- Protected routes (profile, logout) require authentication

## Middleware Execution Order

Middleware runs in the order it's registered. Here's the required sequence:

1. **Security headers (helmet)** - First line of defense, sets HTTP security headers
2. **Body parsers** - Parse JSON, URL-encoded data, and cookies before anything needs to read them
3. **Multer (file upload handling)** - Parse multipart/form-data for routes that accept file uploads (prefer per-route registration to avoid interfering with other parsers)
4. **OpenAPI validator** - Validates request structure against the API contract
5. **Routes** - Your business logic, includes authentication middleware where needed
6. **Error handler** - Catches all errors from middleware and routes, must be registered last

**Note:** Authentication middleware runs within routes, not globally, so public endpoints remain accessible.
