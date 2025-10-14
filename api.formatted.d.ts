// ==========================
// User-related types
// ==========================
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string; // optional field
}

// ==========================
// Post-related types
// ==========================
export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  publishedAt?: string; // optional field
}

// ==========================
// Comment-related types
// ==========================
export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  message: string;
  createdAt: string;
}
