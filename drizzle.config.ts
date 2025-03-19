import { config } from "dotenv";
import { Config } from "drizzle-kit";

config({ path: ".env.local" });

export default {
  schema: "./database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", 
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    
    database: process.env.POSTGRES_DATABASE!,
    ssl: true,
  },
} satisfies Config;