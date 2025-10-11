# Aethel API Contract

The official OpenAPI 3.0 contract for the Aethel API. This document is the single source of truth for all API development, defining every endpoint, schema, and operation.

## Table of Contents

- [Aethel API Contract](#aethel-api-contract)
  - [Table of Contents](#table-of-contents)
  - [Getting Started: Viewing the Contract](#getting-started-viewing-the-contract)
  - [Project TODOs](#project-todos)
  - [Development Workflow](#development-workflow)
  - [How to Contribute](#how-to-contribute)

## Getting Started: Viewing the Contract

This project uses Docker to run a local Swagger UI, providing an interactive way to view the API contract.

**Prerequisites:** You must have [Docker](https://www.docker.com/) and Docker Compose installed.

1.  **Navigate to the directory:**

    ```sh
    cd api-specs
    ```

2.  **Run with Docker Compose:**
    This command will build the required images and start the Swagger services in the background.

    ```sh
    docker compose up --build -d
    ```

3.  **View the API Contract:**
    You can now access the interactive Swagger UI in your browser at:
    **[http://localhost:8080/swagger](http://localhost:8080/swagger)**

    > **Note:** In the Swagger UI, ensure the specification URL in the top bar is set to `./openapi.yaml` to load the contract.

## Project TODOs

- [ ] **Review Endpoints:** Re-check every endpoint, its parameters, and expected responses.
- [ ] **Review Schemas:** Validate all schemas against the ER diagram and update either as needed.
- [ ] **Final Confirmation:** Receive final approval on the contract from both the frontend and backend teams.

## Development Workflow

This contract is the **single source of truth** for all API development.

> [!IMPORTANT]
>
> **Important Note**

- **Frontend - Client SDK:**
  The frontend team will **not** write HTTP request logic by hand. A type-safe client SDK will be automatically generated from this `openapi.yaml` file for direct use.

- **Backend & Frontend - TypeScript Types:**
  All data structures and schemas (`User`, `Document`, etc.) will be generated as TypeScript interfaces, ensuring end-to-end type safety.

Once the contract is finalized, the team lead will provide instructions for the one-time setup of these code generation scripts.

## How to Contribute

- Any required API changes **must** be documented in the `openapi.yaml` file first.
- The Docker environment also hosts a **Swagger Editor** at **[http://localhost:8081](http://localhost:8081)**. Use it for a live preview while editing the contract.
- Once the contract is finalized, both teams can work in parallel with confidence. Future changes are still possible but must follow this same process.
