# 01: Authentication and Users

**Purpose:** Implementation plan for user authentication, session, and profile management endpoints, including security models, DTOs, and logic.

## 1. Core Concepts

### JWT (JSON Web Token) Strategy

- **Access Token + Refresh Token** pattern for sessions.
- **Library:** `jsonwebtoken`
- **Access Token:** Sent in `Authorization` header, payload: `{ userId, iat, exp }`, signed with `JWT_SECRET`, expires in ~15m.
- **Refresh Token:** Used at `POST /auth/refresh`, payload: `{ userId, version }`, signed with `REFRESH_TOKEN_SECRET`, stored hashed in DB, expires in ~7d.

### Password Hashing

- **Library:** `bcrypt`
- **Passwords are never stored in plaintext.**
- **Salt rounds:** ≥12.
- **Verification:** `bcrypt.compare()`
- **TODO:** Implement a DB middleware that always hashes the password before storing/updating, so manual hashing is never needed in code.

### User Service Model

## 3. Endpoint Guide with DTOs & Code Snippets

### User Onboarding (`/auth/register`)

#### DTOs

- **Request:** `RegisterRequestDto`
- **Response:** `UserDto`

#### Example

```typescript
// POST /auth/register
async function registerUser(req: RegisterRequestDto): Promise<UserDto> {
	// Validate input...
	// Check if user exists...
	// Hash password (via DB middleware)...
	// Create user...
	// Send verification email...
	// Return user DTO (no password)
}
```

---

### Session Management

#### `POST /auth/login`

- **Request:** `LoginRequestDto`
- **Response:** `LoginResponseDto`

```typescript
async function loginUser(req: LoginRequestDto): Promise<LoginResponseDto> {
	// Find user by email...
	// Compare password...
	// Generate access & refresh tokens...
	// Store hashed refresh token in DB...
	// Return tokens
}
```

#### `POST /auth/refresh`

- **Request:** `RefreshTokenRequestDto`
- **Response:** `RefreshTokenResponseDto`

```typescript
async function refreshToken(req: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
	// Verify refresh token...
	// Check validity in DB...
	// Generate new access token...
	// Return new access token
}
```

#### `POST /auth/logout`

- **Request:** `LogoutRequestDto`
- **Response:** 200 OK

```typescript
async function logoutUser(req: LogoutRequestDto): Promise<void> {
	// Delete refresh token from DB...
}
```

---

### Account Recovery

#### `POST /auth/forgot-password`

- **Request:** `ForgotPasswordRequestDto`
- **Response:** 200 OK

```typescript
async function forgotPassword(req: ForgotPasswordRequestDto): Promise<void> {
	// Find user by email...
	// Generate & store reset token...
	// Send password reset email...
}
```

#### `POST /auth/reset-password`

- **Request:** `ResetPasswordRequestDto`
- **Response:** 200 OK

```typescript
async function resetPassword(req: ResetPasswordRequestDto): Promise<void> {
	// Find user by reset token...
	// Check expiry...
	// Update password (hashed by DB middleware)...
	// Delete reset token...
}
```

---

### Email Verification

#### `POST /auth/verify-email`

- **Request:** `VerifyEmailRequestDto`
- **Response:** 200 OK

```typescript
async function verifyEmail(req: VerifyEmailRequestDto): Promise<void> {
	// Find user by verification token...
	// Mark email as verified...
}
```

---

### User Profile Management (`/users/me`)

#### `GET /users/me`

- **Response:** `UserDto`

```typescript
async function getCurrentUser(userId: string): Promise<UserDto> {
	// Fetch user by ID...
	// Return user DTO
}
```

#### `PATCH /users/me`

- **Request:** `UpdateProfileRequestDto`
- **Response:** `UserDto`

```typescript
async function updateProfile(userId: string, req: UpdateProfileRequestDto): Promise<UserDto> {
	// Update display_name/username...
	// Return updated user DTO
}
```

#### `DELETE /users/me`

- **Response:** 204 No Content

```typescript
async function deleteUser(userId: string): Promise<void> {
	// Cascaded delete of user and all data...
}
```

---

## 4. Mapping OpenAPI to DTOs

- All DTOs above are derived from the OpenAPI contract.
- Use these DTOs for request/response validation and documentation.
- Keep DTOs in sync with OpenAPI schemas for consistency.
