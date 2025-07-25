import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { DATABASE_URL } from "./src/config/env.js";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
