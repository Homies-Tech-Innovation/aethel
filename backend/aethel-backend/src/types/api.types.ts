import type { paths, components } from "./api";

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// POST /auth/register
export type RegisterRequest = paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"];
export type RegisterResponse = components["schemas"]["User"];

// POST /auth/login
export type LoginRequest = paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];
// No response body (200 with no content)

// POST /auth/logout
// No request or response body (200 with no content)

// POST /auth/verify-email
export type VerifyEmailRequest = paths["/auth/verify-email"]["post"]["requestBody"]["content"]["application/json"];
// No response body (200 with no content)

// POST /auth/forgot-password
export type ForgotPasswordRequest =
	paths["/auth/forgot-password"]["post"]["requestBody"]["content"]["application/json"];
// No response body (200 with no content)

// POST /auth/reset-password
export type ResetPasswordRequest = paths["/auth/reset-password"]["post"]["requestBody"]["content"]["application/json"];
// No response body (200 with no content)

// POST /auth/refresh
// No request or response body (200 with no content)

// ============================================
// USER ENDPOINTS
// ============================================

// GET /users/me
export type GetCurrentUserResponse = components["schemas"]["User"];

// PATCH /users/me
export type UpdateProfileRequest = paths["/users/me"]["patch"]["requestBody"]["content"]["application/json"];
export type UpdateProfileResponse = components["schemas"]["User"];

// PATCH /users/me/avatar
export type UpdateAvatarRequest = paths["/users/me/avatar"]["patch"]["requestBody"]["content"]["application/json"];
export type UpdateAvatarResponse = components["schemas"]["User"];

// DELETE /users/me
// No request or response body (204 No Content)

// ============================================
// WORKSPACE ENDPOINTS
// ============================================

// GET /workspace/hierarchy
export type GetWorkspaceHierarchyResponse = components["schemas"]["WorkspaceNode"][];

// ============================================
// FOLDER ENDPOINTS
// ============================================

// POST /folders
export type CreateFolderRequest = paths["/folders"]["post"]["requestBody"]["content"]["application/json"];
export type CreateFolderResponse = components["schemas"]["Folder"];

// GET /folders/{id}
export type GetFolderResponse = components["schemas"]["Folder"];

// PATCH /folders/{id}
export type UpdateFolderRequest = paths["/folders/{id}"]["patch"]["requestBody"]["content"]["application/json"];
export type UpdateFolderResponse = components["schemas"]["Folder"];

// DELETE /folders/{id}
// No request or response body (204 No Content)

// ============================================
// DOCUMENT ENDPOINTS
// ============================================

// POST /documents
export type CreateDocumentRequest = paths["/documents"]["post"]["requestBody"]["content"]["application/json"];
export type CreateDocumentResponse = components["schemas"]["Document"];

// GET /documents/{id}
export type GetDocumentResponse = components["schemas"]["Document"];

// PATCH /documents/{id}
export type UpdateDocumentRequest = paths["/documents/{id}"]["patch"]["requestBody"]["content"]["application/json"];
export type UpdateDocumentResponse = components["schemas"]["Document"];

// DELETE /documents/{id}
// No request or response body (204 No Content)

// ============================================
// IMAGE ENDPOINTS
// ============================================

// POST /images
export type UploadImageRequest = paths["/images"]["post"]["requestBody"]["content"]["multipart/form-data"];
export type UploadImageResponse = components["schemas"]["Image"];

// GET /images/{id}
export type GetImageResponse = components["schemas"]["Image"];

// DELETE /images/{id}
// No request or response body (204 No Content)

// ============================================
// AI ENDPOINTS
// ============================================

// POST /ai/message
export type SendAIMessageRequest = paths["/ai/message"]["post"]["requestBody"]["content"]["application/json"];
export type SendAIMessageResponse = components["schemas"]["AIResponseMessage"];

// POST /ai/chat
export type SendChatMessageRequest = paths["/ai/chat"]["post"]["requestBody"]["content"]["application/json"];
export type SendChatMessageResponse = components["schemas"]["ChatInteractionResponse"];

// GET /ai/chats
export type GetAllChatsResponse = components["schemas"]["ChatSessionSummary"][];

// GET /ai/chats/{id}
export type GetChatHistoryResponse = components["schemas"]["ChatSession"];

// DELETE /ai/chats/{id}
// No request or response body (204 No Content)

// GET /ai/suggestions/{id}
export type GetAISuggestionResponse = components["schemas"]["AISuggestion"];

// ============================================
// ERROR RESPONSES
// ============================================

export type UnauthorizedError = components["responses"]["Unauthorized"]["content"]["application/json"];
export type BadRequestError = components["responses"]["BadRequest"]["content"]["application/json"];
export type NotFoundError = components["responses"]["NotFound"]["content"]["application/json"];
