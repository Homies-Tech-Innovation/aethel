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

async function getCurrentUser(req: Request, res: Response): Promise<void> {
	// Get userId from req.user (auth middleware)
	// Fetch user by ID
	// Send user as JSON (GetCurrentUserResponse)
}
```

#### `PATCH /users/me`

```ts
import type { UpdateProfileRequest, UpdateProfileResponse } from "@/types";
import type { Request, Response } from "express";

async function updateProfile(req: Request<any, any, UpdateProfileRequest>, res: Response): Promise<void> {
	// Get userId from req.user
	// Update display_name / username
	// Return updated user as JSON (UpdateProfileResponse)
}
```

#### `PATCH /users/me/avatar`

```ts
import type { UpdateAvatarRequest, UpdateAvatarResponse } from "@/types";
import type { Request, Response } from "express";

async function updateAvatar(req: Request, res: Response): Promise {
	// Get userId from req.user
	// Validate avatar_url format (should be valid URI)
	// Update user's avatar_url in database
	// Return updated user as JSON (UpdateAvatarResponse)
}
```

- **Request:** `UpdateAvatarRequest` (contains `avatar_url`)
- **Response:** `UpdateAvatarResponse` (`User` schema with updated avatar_url)

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
