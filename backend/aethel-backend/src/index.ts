import { config } from "@/config";
import { connectDB } from "@/config";

connectDB();

console.log("Environment Configuration Loaded:");
console.log(config);
