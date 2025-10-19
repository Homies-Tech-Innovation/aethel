import * as z from "zod";
import "dotenv/config";

const EnvSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().url("MONGODB_URI must be a valid MongoDB connection URL"),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .regex(/^\d+[smhd]$/, "ACCESS_TOKEN_EXPIRY must be like '15m', '7d', etc."),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .regex(/^\d+[smhd]$/, "REFRESH_TOKEN_EXPIRY must be like '7d', '30d', etc."),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  // Pino Logger
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

// Validate process.env
const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(z.prettifyError(parsedEnv.error));
  process.exit(1); 
}

const ENV = parsedEnv.data;

export default ENV;