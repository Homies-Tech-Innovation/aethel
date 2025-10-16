## Requested Changes

### 1. Router Organization Guide

**Add to 01-Authentication-and-Users.md after "Auth Middleware Setup":**

### Router Organization

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
└── images.routes.ts    # /images/* endpoints
```

**Route File Pattern:**
Each route file exports a Router instance with all paths for that resource.

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

- Apply `authenticate` middleware per-route or per-router based on protection needs
- Public routes (register, login) don't need authentication
- Protected routes (profile, logout) require authentication

---

### 2. JWT Token Payload

**Add to 01-Authentication-and-Users.md in "JWT Strategy" section, right after the token pattern bullet:**

- **Token Payload:**
  - Include only the `userId` (as a string)
  - Do not include sensitive data (email, password, roles)
  - Do not include frequently changing data (display name, avatar)
  - Keep payload minimal for smaller token size and better performance

Example payload:

```ts
const payload = {
	userId: user._id.toString(),
};
const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
```

---

### 3. Authentication Middleware Error Codes

**Update your Auth Middleware section to include error codes:**

### Authentication Middleware

Create a middleware to verify JWT tokens and attach user info to the request:

```ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
	// Extract token from cookie or Authorization header
	// If no token found: 401 Unauthorized
	// Verify token using JWT
	// If verification fails (invalid/expired): 401 Unauthorized
	// Attach user id to request object
	// Call next()
}

export { authenticate };
```

**Error Responses:**

- **401 Unauthorized:** Missing token, invalid token, or expired token
- **403 Forbidden:** Token valid but user lacks permission (not used in this middleware, reserved for authorization checks)

---

### 4. Fix 03-Image-Uploads.md

Remove the detailed field listings from the `POST /images` and `GET /images/{id}` responses. Keep only the simplified responses:

For POST /images:

- **Response:** `CreateImageResponse` (201 Created)
- **Errors:** 400 (missing file), 401 (unauthorized), 415 (unsupported media type), 500 (server error)

For GET /images/{id}:

- **Response:** `GetImageResponse` (200 OK)
- **Errors:** 404 (not found)

---

### 5. Fix 00-Core-Architecture-and-Setup.md

Change the line with `prisma/` to:

```text
│ │ ├── models/ # Mongoose models and schemas
```

---

## Summary

1. Add router organization guide to 01 doc
2. Add JWT payload best practice to 01 doc
3. Add error codes to your auth middleware section
4. Strip detailed response shapes from 03 doc
5. Fix prisma → models in 00 doc

That's it - minimal, focused changes that fit your existing style.
