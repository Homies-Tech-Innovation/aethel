import { connectDB, config } from "@/config";
import { logger } from "@/utils";

connectDB();

logger.info(config, "Environment Configuration Loaded:");
