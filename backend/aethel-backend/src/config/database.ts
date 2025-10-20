import mongoose from "mongoose";
import { config } from "@/config/config";
import { logger } from "@/utils";
/**
 * Connects to MongoDB using Mongoose with proper error handling and logging.
 */
export const connectDB = async (): Promise<void> => {
	try {
		// Connect to MongoDB
		logger.info(config.MONGODB_URI);
		const connection_instance = await mongoose.connect(config.MONGODB_URI);

		const conn = connection_instance.connection;
		const details = {
			host: conn.host ?? "unknown",
			port: conn.port ?? "unknown",
			name: conn.name ?? conn.db?.databaseName ?? "unknown",
		};

		logger.info(details, "MongoDB connected successfully:");
	} catch (error: unknown) {
		logger.error(error, `MongoDB connection failed: ${error instanceof Error ? error.message : ""}`);
		process.exit(1);
	}
};
