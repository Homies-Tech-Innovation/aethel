import Env from "./config"
import { connectDB } from "./config/database";

connectDB();

console.log("Environment Configuration Loaded:");
console.log(Env);