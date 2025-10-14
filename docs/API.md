# Aethel Project - API Types & Client SDK

This document explains how to use the **generated TypeScript types** and **Client SDK** in the Aethel project.

---

## 1. API Types

All API calls now use the generated TypeScript types instead of hardcoding schemas.  
The types are available in `api.formatted.d.ts`.

### Importing Types

```ts
import { User, Post, Comment } from '../api.formatted';
