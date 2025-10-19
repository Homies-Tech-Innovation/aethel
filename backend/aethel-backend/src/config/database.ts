import mongoose from "mongoose";
import { config } from "@/config/config";

/**
 * Connects to MongoDB using Mongoose with proper error handling and logging.
 */
export const connectDB = async (): Promise<void> => {
	try {
		// Connect to MongoDB
		console.log(config.MONGODB_URI);
		const connection_instance = await mongoose.connect(config.MONGODB_URI);

		const conn = connection_instance.connection;
		const details = {
			host: conn.host ?? "unknown",
			port: conn.port ?? "unknown",
			name: conn.name ?? conn.db?.databaseName ?? "unknown",
		};

		console.log("MongoDB connected successfully:", details);
	} catch (error) {
		console.error("MongoDB connection failed:", error);
		process.exit(1);
	}
};
