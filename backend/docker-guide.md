# PostgreSQL Docker Compose Cheat Sheet

## Required Daily Workflow

This is the only workflow supported for local development.

1.  **Configure the Database:**
    In the project root (`backend/`), copy the environment example file to create your Docker environment file.

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

## Environment Variable Management

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

## Quick Commands

- **Connect to Postgres:**

  ```
  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>
  ```

- **Stop the container:**

  ```bash
  docker compose down
  ```

- **Check logs:**

  ```bash
  docker compose logs -f db
  ```

- **Manage volumes:**
  ```bash
  docker volume ls
  docker volume inspect pg_data
  ```

## Notes

- `.env.docker` contains sensitive credentials. **Do not commit it to Git.**
- `postgres-data/` is persisted in a Docker volume (`pg_data`) and should **not** be committed.
- Use `.env.docker` for Compose environment variables; you can safely version `.env.docker.example` as a template.
