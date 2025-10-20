import { pinoHttp } from "pino-http";
import pino, { multistream } from "pino";
import fs from "fs";
import path from "path";
import { config } from "@/config";

// Check if directory exists; If not, then create it
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, "app.log");

// Create logger with pino-pretty in non-production, plain file and console destinations in production
let destination: any;
if (!config.isDev) {
	destination = multistream([{ stream: pino.destination({ dest: logFile, sync: false }) }, { stream: process.stdout }]);
} else {
	// Use pino.transport to run pino-pretty as a transport for human-readable logs
	destination = multistream([
		{ stream: pino.destination({ dest: logFile, sync: false }) },
		{
			stream: pino.transport({
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			}),
		},
	]);
}

// Logger instance
export const logger = pino(
	{
		level: config.LOG_LEVEL || "info",
	},
	destination
);

// HTTP middleware (uses same logger)
export const pinoMiddleware = pinoHttp({ logger });
