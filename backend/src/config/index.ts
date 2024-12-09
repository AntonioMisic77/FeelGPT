import dotenv from "dotenv";

dotenv.config();
const config = {
  // General config
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "your_secret_key",
};

export default config;
