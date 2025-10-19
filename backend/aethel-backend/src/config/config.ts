import * as z from "zod";
import "dotenv/config";

const EnvSchema = z
	.object({
		// MongoDB
		MONGODB_USERNAME: z.string().min(1, "MONGODB_USERNAME is required"),
		MONGODB_PASSWORD: z.string().min(1, "MONGODB_PASSWORD is required"),
		MONGODB_HOST: z.string().min(1, "MONGODB_HOST is required"),
		MONGODB_PORT: z.string().regex(/^\d+$/, "MONGODB_PORT must be a valid port number").transform(Number),
		MONGODB_DATABASE: z.string().min(1, "MONGODB_DATABASE is required"),

		// JWT
		ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
		ACCESS_TOKEN_EXPIRY: z.string().regex(/^\d+[smhd]$/, "ACCESS_TOKEN_EXPIRY must be like '15m', '7d', etc."),
		REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
		REFRESH_TOKEN_EXPIRY: z.string().regex(/^\d+[smhd]$/, "REFRESH_TOKEN_EXPIRY must be like '7d', '30d', etc."),

		// Cloudinary
		CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
		CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
		CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

		// Pino Logger
		LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
	})
	.transform((env) => ({
		...env,
		MONGODB_URI: `mongodb://${env.MONGODB_USERNAME}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}:${env.MONGODB_PORT}`,
	}));

// Validate process.env
const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("Invalid environment configuration:");
	console.error(z.prettifyError(parsedEnv.error));
	process.exit(1);
}

const config = parsedEnv.data;

export { config };
