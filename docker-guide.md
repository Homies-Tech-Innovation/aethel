# 🧩 Docker Compose Cheat Sheet

## 🚀 Local Development Workflow

This workflow is the **only supported way** to run the local stack (PostgreSQL + Swagger UI + Swagger Editor).

### 1️⃣ Configure the Environment

From your project root (e.g. `aethel/`), copy the example environment file and set up your Docker configuration:

```bash
cp .env.docker.example .env.docker
```

Edit `.env` and fill in your PostgreSQL credentials:

```bash
# Database configuration
MONGO_INITDB_ROOT_USERNAME=aditsuru
MONGO_INITDB_ROOT_PASSWORD=secret123
MONGO_INITDB_DATABASE=aethel_db
```

### 2️⃣ Start the Containers

From the project root, launch all services in detached mode:

```bash
docker compose up -d
```

This will start:

- **MongoDB** (port `27017`)
- **Swagger UI** (port `8080`)
- **Swagger Editor** (port `8081`)

Swagger will automatically read from your local `openapi.yaml`.

### 3️⃣ Run Your Backend Locally

In another terminal:

```bash
cd aethel-backend
cp .env.example .env
npm install
npm run dev
```

Your backend will connect to the database running in Docker via:

```
mongodb://aditsuru:secret123@localhost:27017/aethel_db
```

## 🧰 Quick Commands

### Start all services:

```bash
docker compose up -d
```

### Start only PostgreSQL:

```bash
docker compose up -d db
```

### Start only Swagger services (UI + Editor):

```bash
docker compose up -d swagger-ui swagger-editor
```

### Stop containers:

```bash
docker compose down
```

### Check container logs:

```bash
docker compose logs -f db
docker compose logs -f swagger-ui
docker compose logs -f swagger-editor
```

### Connect to Postgres shell:

```bash
docker exec -it aethel-mongo-db mongo -u aditsuru -p secret123 --authenticationDatabase admin
```

### Manage Docker volumes:

```bash
docker volume ls
docker volume inspect pg_data
```

## ⚙️ Environment Variable Management

### 🐳 `.env.docker` (used by Docker Compose)

This file is **read by Docker only**. It defines the container’s environment — especially the PostgreSQL credentials.

**Example `.env.docker.example`:**

```bash
MONGO_INITDB_ROOT_USERNAME=aditsuru
MONGO_INITDB_ROOT_PASSWORD=secret123
MONGO_INITDB_DATABASE=aethel_db
```

**Rules:**

- Never commit `.env.docker` to Git.
- Always version-control `.env.docker.example` as a reference template.

## 📝 Notes

- `.env.docker` contains **sensitive credentials** — never commit it.
- MongoDB data is persisted in the Docker volume (`mongo_data`) — don’t delete unless you want a clean slate.
- Swagger UI reads from `./openapi.yaml`. Any changes to that file are reflected automatically when refreshed.
- If Swagger doesn’t reload, restart it with:

  ```bash
  docker compose restart swagger-ui
  ```
