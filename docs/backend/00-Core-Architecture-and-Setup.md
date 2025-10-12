# 00: Core Architecture and Setup

**Purpose:** This document defines the foundational technology stack, project structure, core patterns, and development environment for the Aethel application. All developers must adhere to these standards to ensure consistency and maintainability.

## 1. Technology Stack

The following tools have been selected for the project. There should be no deviation from this stack without formal approval.

- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM / Database Client:** Prisma ORM for database access, schema management, and migrations.
- **API Contract Validation:** `express-openapi-validator` to enforce the OpenAPI contract at the middleware level.
- **Containerization:** Docker

## 2. Monorepo and Project Structure

The project is organized as a monorepo containing multiple services. This guide focuses on the main `aethel-backend` service.

```
backend/
├── aethel-backend/
│   ├── src/
│   │   ├── config/              # Typed environment variables and app configuration (config.ts)
│   │   ├── controllers/         # Route handlers (e.g., auth.controller.ts)
│   │   ├── middlewares/         # Custom Express middlewares (e.g., isAuthenticated.ts)
│   │   ├── prisma/              # Prisma schema, client, and migrations
│   │   ├── routes/              # Express route definitions (e.g., auth.routes.ts)
│   │   ├── services/            # Business logic and external API integrations (e.g., user.service.ts)
│   │   ├── types/               # Shared or generated TypeScript types
│   │   ├── utils/               # Utility functions and helpers (e.g., logger.ts)
│   │   └── index.ts             # Application entry point
│   ├── .env                     # Local development environment variables (git-ignored)
│   ├── .env.example             # Example environment variable template
│   └── package.json             # Project dependencies and scripts
├── .env.docker                 # For Docker Compose to configure the DB (git-ignored)
├── .env.docker.example         # Template for .env.docker
└── docker-compose.yml          # Spins up the database container only
```

## 3. Development Environment and Docker

Docker Compose is used **exclusively** to run the PostgreSQL database in a consistent environment. The backend service itself **must** be run locally for development to ensure access to debugging tools and hot-reloading.

### Required Daily Workflow

This is the only workflow supported for local development.

1.  **Configure the Database:**
    In the project root (`backend/`), copy the example file to create your Docker environment file.

    ```sh
    cp .env.docker.example .env.docker
    ```

    Fill this file with the `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.

2.  **Start the Database Container:**
    From the project's root directory (`backend/`), run:

    ```sh
    docker-compose up -d
    ```

    This starts the PostgreSQL container and exposes its port `5432` to your `localhost`.

3.  **Run the Backend Locally:**
    Navigate to the backend service folder, create your local `.env` file, and start the server.
    ```sh
    cd aethel-backend
    cp .env.example .env # And fill it with your app secrets (JWT, etc.)
    npm install
    npm run dev
    ```
    The local server will connect to the database running in Docker.

### Environment Variable Management

To make this hybrid workflow seamless, we use two separate configuration files.

1.  **For Docker (`.env.docker` at the root):**
    This file is **only** read by Docker Compose to configure the database container itself.

    - **Example (`.env.docker.example`):**
      ```bash
      POSTGRES_USER=myuser
      POSTGRES_PASSWORD=mypassword
      POSTGRES_DB=aethel_db
      ```

2.  **For the Local Backend (`aethel-backend/.env`):**
    This is the file your Node.js application reads when you run `npm run dev`. It contains your application secrets and the full connection string to the database.

    - **Example (`aethel-backend/.env.example`):**

      ```bash
      # This URL connects to the database Docker exposes to your machine
      DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/aethel_db"

      # Application-specific variables
      PORT=3000
      JWT_SECRET="your-long-random-jwt-secret"
      JWT_EXPIRES_IN=15m
      REFRESH_TOKEN_SECRET="your-different-long-random-secret"
      REFRESH_TOKEN_EXPIRES_IN=7d
      LOG_LEVEL=debug
      ```

> **Note:** This setup is intentional and restrictive for simplicity. When the project requires running the backend service inside Docker (e.g., for CI or a different testing strategy), this guide will be updated by the team lead.

## 4. Database Schema Management

- **Source of Truth:** The `aethel-backend/prisma/schema.prisma` file is the single source of truth for the database schema.
- **Migrations:** Schema changes must be managed exclusively through Prisma's migration tool.
  - **Command:** `npx prisma migrate dev` will be used to generate and apply new SQL migration files during development.

## 5. Error Handling

A standardized approach to error handling is mandatory for a predictable API.

- **Error Response Schema:** All errors returned to the client **must** conform to the `Error` schema defined in `openapi.yaml`.
  ```json
  {
  	"error": "Bad Request",
  	"message": "Email address is already in use."
  }
  ```
- **Global Error Handler:** A single, global error handling middleware in Express will catch all errors, format them into the standard response, and send them to the client.

## 6. Logging

- **Library:** Pino.js will be used for structured, high-performance logging.
- **Log Levels:** Controlled by the `LOG_LEVEL` environment variable.
  - `info`: Log all incoming HTTP requests and their responses.
  - `error`: Log all uncaught exceptions and handled operational errors.
  - `debug`: Log important steps within service logic. Should be disabled in production.
