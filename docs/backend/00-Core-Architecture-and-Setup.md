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

## 4. Error Handling

A standardized error handling approach is required for a predictable API.

- **Error Schema:** All errors returned to the client must conform to the `Error` schema in `types`.

```ts
import type { BadRequestError, UnauthorizedError, NotFoundError } from "@/types";
```

e.g.

```ts
throw new ApiError<BadRequestError>("Email is already in use");
```

- Implement a global `ApiError` class to raise errors, which are handled by a global error middleware.
- The global error handler formats all errors into the standard response and sends them to the client.

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
3. **OpenAPI validator** - Validates request structure against the API contract
4. **Routes** - Your business logic, includes authentication middleware where needed
5. **Error handler** - Catches all errors from middleware and routes, must be registered last

**Note:** Authentication middleware runs within routes, not globally, so public endpoints remain accessible.

## Global Error Handler
