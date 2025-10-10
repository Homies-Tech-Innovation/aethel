# Docker Setup for Local Development

This document outlines how to set up and run the local development environment using Docker. It describes a conceptual Docker Compose setup for the project's anticipated architecture, which includes a database, backend, AI service, and frontend.

## Prerequisites

Before you begin, ensure you have Docker and Docker Compose installed on your system.

## High-Level Structure of `docker-compose.yml`

The `docker-compose.yml` file orchestrates the various services that make up our development environment. Based on the project's design, a typical setup would include:

-   **Database Service (DB):** A PostgreSQL instance for data persistence.
-   **Backend Service:** The main application logic, likely a web server or API, interacting with the database.
-   **AI Service:** A dedicated service for AI/ML model inference or processing, potentially interacting with the backend.
-   **Frontend Service:** The user interface, a web application that communicates with the backend.

Here's a conceptual overview of how these services would be defined in `docker-compose.yml`:

```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    container_name: aethel_db
    environment:
      POSTGRES_DB: aethel_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d aethel_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend # Assuming a 'backend' directory will exist
      dockerfile: Dockerfile
    container_name: aethel_backend
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://user:password@db:5432/aethel_db
      # Other backend-specific environment variables

  ai-service:
    build:
      context: ./ai-service # Assuming an 'ai-service' directory will exist
      dockerfile: Dockerfile
    container_name: aethel_ai_service
    ports:
      - "5000:5000"
    depends_on:
      backend:
        condition: service_started # Or service_healthy if it has a healthcheck
    # Other AI service-specific environment variables

  frontend:
    build:
      context: ./frontend # Assuming a 'frontend' directory will exist
      dockerfile: Dockerfile
    container_name: aethel_frontend
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_started # Or service_healthy
    # Other frontend-specific environment variables

volumes:
  db_data:
```

## Running and Stopping Services

To manage the Dockerized development environment, use the following commands from the root of the project directory where `docker-compose.yml` is located.

### Starting Services

To start all services in detached mode (running in the background):

```bash
docker-compose up -d
```

To start services and view their logs in the foreground (useful for debugging):

```bash
docker-compose up
```

### Stopping Services

To stop all running services and remove their containers, networks, and volumes (if specified):

```bash
docker-compose down
```

To stop services but keep their containers and networks (useful for quick restarts without losing container state):

```bash
docker-compose stop
```

### Rebuilding Services

If you make changes to your Dockerfiles or `docker-compose.yml`, you might need to rebuild your services:

```bash
docker-compose build
```

To rebuild and restart all services:

```bash
docker-compose up -d --build
```

## Overview of Containers

### DB (Database Service)
-   **Purpose:** Provides a persistent PostgreSQL database instance for the application's data.
-   **Image:** Uses `postgres:13` for a stable PostgreSQL version.
-   **Ports:** Mapped to `5432` on the host machine, allowing direct access to the database if needed.
-   **Data Persistence:** Uses a Docker volume (`db_data`) to ensure database data is not lost when containers are stopped or removed.
-   **Healthcheck:** Includes a healthcheck to ensure the database is ready to accept connections before dependent services start.

### Backend Service
-   **Purpose:** Hosts the core application logic, REST APIs, and handles interactions with the database.
-   **Build Context:** Assumes a `Dockerfile` will be located in a `./backend` directory.
-   **Ports:** Exposes the backend application's port (e.g., `8000`) to the host.
-   **Dependencies:** Configured to start only after the `db` service is healthy, ensuring database availability.

### AI Service
-   **Purpose:** Dedicated to handling AI/ML model inference, data processing, or agent-specific logic.
-   **Build Context:** Assumes a `Dockerfile` will be located in an `./ai-service` directory.
-   **Ports:** Exposes a specific port for AI-related API calls (e.g., `5000`).
-   **Dependencies:** May depend on the `backend` service for data or orchestration, or run independently.

### Frontend Service
-   **Purpose:** Serves the user interface of the application, consuming APIs from the backend.
-   **Build Context:** Assumes a `Dockerfile` will be located in a `./frontend` directory.
-   **Ports:** Exposes the web application port (e.g., `3000`) to the host.
-   **Dependencies:** Typically depends on the `backend` service to fetch data and functionality.

## Example Commands for Developers

Here are some common commands you might use during development:

-   **Start the entire development environment:**
    ```bash
    docker-compose up -d
    ```

-   **View logs for a specific service (e.g., backend):**
    ```bash
    docker-compose logs -f backend
    ```

-   **Execute a command inside a running service container (e.g., run database migrations in backend):**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```
    (Replace `python manage.py migrate` with the appropriate command for your backend framework, e.g., `npm run migrate` for Node.js or `flask db upgrade` for Flask.)

-   **Access the database shell:**
    ```bash
    docker-compose exec db psql -U user aethel_db
    ```
    (For PostgreSQL; adjust command for MySQL or other databases if used.)

-   **Stop and remove all services and volumes (for a clean slate):**
    ```bash
    docker-compose down -v
