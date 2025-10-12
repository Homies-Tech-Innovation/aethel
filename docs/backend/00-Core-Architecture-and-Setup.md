# 00: Core Architecture and Setup

**Purpose:** This document defines the foundational technology stack, project structure, core patterns, and development environment for the Aethel application. All developers must follow these standards to ensure consistency and maintainability.

## 1. Technology Stack

The following tools are required for the project. Any changes must be formally approved.

- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma (for database access, schema management, and migrations)
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
│   │   ├── prisma/         # Prisma schema, client, and migrations
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

Docker Compose is used **only** to run the PostgreSQL database. The backend service must be run locally for development to enable debugging and hot-reloading.

See the [Docker Guide](../../backend/docker-guide.md) for details.

> **Note:** This setup is intentionally restrictive for simplicity. If running the backend in Docker becomes necessary (e.g., for CI or testing), this guide will be updated.

## 4. Database Schema Management

- **Source of Truth:** `aethel-backend/prisma/schema.prisma`
- **Migrations:** Use Prisma's migration tool for all schema changes.
  - **Command:** `npx prisma migrate dev` (generates and applies migrations during development)

## 5. Error Handling

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

## 6. Logging

- **Library:** Pino.js for structured, high-performance logging.
- **Log Levels:** Controlled by the `LOG_LEVEL` environment variable.
  - `info`: Log all HTTP requests and responses.
  - `error`: Log uncaught exceptions and operational errors.
  - `debug`: Log key steps in service logic (should be disabled in production).
