# PostgreSQL Docker Compose Cheat Sheet

## Setup

1. **Copy the example environment file:**

   ```bash
   cp .env.docker.example .env.docker
   ```

   Edit `.env.docker` with your username, password, and database name.

2. **Start the container:**

   ```bash
   docker compose up -d
   ```

3. **Stop the container:**
   ```bash
   docker compose down
   ```

---

## Quick Commands

- **Connect to Postgres:**

  ```
  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>
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

---

## Notes

- `.env.docker` contains sensitive credentials. **Do not commit it to Git.**
- `postgres-data/` is persisted in a Docker volume (`pg_data`) and should **not** be committed.
- Use `.env.docker` for Compose environment variables; you can safely version `.env.docker.example` as a template.
