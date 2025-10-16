# 01: Authentication and Users

**Purpose:** Implementation plan for user authentication, session, and profile management endpoints, including security models, DTOs (OpenAPI-generated types), and core logic.

## Core Concepts

### JWT (JSON Web Token) Strategy

- **Library:** `jsonwebtoken`
- **Token Pattern:** Use both **access** and **refresh** tokens.
  - Both tokens are sent to the client via cookies.
  - Tokens can be received from:
    - Cookies: `req.cookies?.accessToken` / `req.cookies?.refreshToken`
    - Authorization header:
      ```ts
      req.headers["authorization"]?.replace("Bearer ", "");
      ```
- **Token Payload:**
  - Include only the `userId` (as a string)
  - Do not include sensitive data (email, password, roles)
  - Do not include frequently changing data (display name, avatar)
  - Keep payload minimal for smaller token size and better performance
- **Cookie Options:**
  ```ts
  const cookieOptions = {
  	httpOnly: true,
  	secure: true,
  	sameSite: "strict",
  };
  ```
- **Required Environment Variables:**
  - `ACCESS_TOKEN_SECRET`
  - `ACCESS_TOKEN_EXPIRY` (e.g., `1d`)
  - `REFRESH_TOKEN_SECRET`
  - `REFRESH_TOKEN_EXPIRY` (e.g., `28d`)

### Password Hashing

- **Library:** `bcrypt`
- Never store passwords in plaintext.
- Use at least 12 salt rounds.
- Verify with `bcrypt.compare()`.
- **[TODO] DB middleware:** Automatically hash passwords before insert/update to avoid manual hashing.

## Endpoint Guide

### 1.1 `POST /auth/register`

```ts
import type { RegisterRequest, RegisterResponse } from "@/types";

async function registerUser(req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>) {
	// Validate input
	// Check if user exists
	// Create user (password hashed via middleware)
	// Send verification email
	// Return user (RegisterResponse)
	// Log registration event
}
```

- **Request:** `RegisterRequest`
- **Response:** `RegisterResponse` (`User` schema)

### 1.2 Session Management

#### `POST /auth/login`

```ts
import type { LoginRequest } from "@/types";
import type { Request, Response } from "express";

async function loginUser(req: Request<any, any, LoginRequest>, res: Response): Promise<void> {
	// Validate input (OpenAPI middleware)
	// Find user by email
	// Compare password with hashed password
	// Generate access & refresh tokens
	// Set cookies for tokens
	// Send 200 OK (no body)
}
```

- **Request:** `LoginRequest`
- **Response:** No body; tokens set as cookies

#### `POST /auth/refresh`

```ts
import type { Request, Response } from "express";

async function refreshToken(req: Request, res: Response): Promise<void> {
	// Read refresh token from cookie or header
	// Verify JWT
	// Fetch user from DB
	// Check refresh token matches DB
	// Generate new tokens
	// Set cookies for tokens
	// Send 200 OK (no body)
}
```

- **Request:** No body; uses cookie
- **Response:** No body; new tokens via cookies

#### `POST /auth/logout`

```ts
import type { Request, Response } from "express";

async function logoutUser(req: Request, res: Response): Promise<void> {
	// Read refresh token from cookie or header
	// Delete refresh token from DB
	// Clear cookies for tokens
	// Send 200 OK (no body)
}
```

### 2.3 Account Recovery

#### `POST /auth/forgot-password`

```ts
import type { ForgotPasswordRequest } from "@/types";
import type { Request, Response } from "express";

async function forgotPassword(req: Request<any, any, ForgotPasswordRequest>, res: Response): Promise<void> {
	// Validate input (OpenAPI middleware)
	// Find user by email
	// Generate & store reset token
	// Send password reset email
	// Send 200 OK (no body)
}
```

- **Response:** 200 OK, no body

#### `POST /auth/reset-password`

```ts
import type { ResetPasswordRequest } from "@/types";
import type { Request, Response } from "express";

async function resetPassword(req: Request<any, any, ResetPasswordRequest>, res: Response): Promise<void> {
	// Validate input (OpenAPI middleware)
	// Find user by reset token
	// Check if token expired
	// Update password (hashed via middleware)
	// Delete reset token
	// Send 200 OK (no body)
}
```

- **Response:** 200 OK, no body

### 2.4 Email Verification

#### `POST /auth/verify-email`

```ts
import type { VerifyEmailRequest } from "@/types";
import type { Request, Response } from "express";

async function verifyEmail(req: Request<any, any, VerifyEmailRequest>, res: Response): Promise<void> {
	// Validate input (OpenAPI middleware)
	// Find user by verification token
	// Mark email as verified
	// Send 200 OK (no body)
}
```

- **Response:** 200 OK, no body

### 2.5 User Profile Management

#### `GET /users/me`

```ts
import type { GetCurrentUserResponse } from "@/types";
import type { Request, Response } from "express";

async function getCurrentUser(req: Request, res: Response<GetCurrentUserResponse>): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Fetch user by ID
	// Send user as JSON (GetCurrentUserResponse)
}
```

#### `PATCH /users/me`

```ts
import type { UpdateProfileRequest, UpdateProfileResponse } from "@/types";
import type { Request, Response } from "express";

async function updateProfile(
	req: Request<any, any, UpdateProfileRequest>,
	res: Response<UpdateProfileResponse>
): Promise<void> {
	// Get userId from req.user
	// Update displayName
	// Return updated user as JSON (UpdateProfileResponse)
}
```

#### `PATCH /users/me/avatar`

```ts
import type { UpdateAvatarRequest, UpdateAvatarResponse } from "@/types";
import type { Request, Response } from "express";

async function updateAvatar(
	req: Request<any, any, UpdateAvatarRequest>,
	res: Response<UpdateAvatarResponse>
): Promise<void> {
	// Get userId from req.user
	// Validate avatarUrl format (should be valid URI)
	// Update user's avatarUrl in database
	// Return updated user as JSON (UpdateAvatarResponse)
}
```

- **Request:** `UpdateAvatarRequest` (contains `avatarUrl`)
- **Response:** `UpdateAvatarResponse` (`User` schema with updated `avatarUrl`)

#### `DELETE /users/me`

```ts
import type { Request, Response } from "express";

async function deleteUser(req: Request, res: Response): Promise<void> {
	// Get userId from req.user
	// Delete user and associated data
	// Clear authentication cookies
	// Send 204 No Content
}
```

- **Response:** 204 No Content

## Auth Middleware Setup

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
