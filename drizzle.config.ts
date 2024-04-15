import type { Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  driver: 'pg', 
  dbCredentials: {
    connectionString: 'postgresql://docker:docker@localhost:5432/pizza_shop',
  },
} satisfies Config;