import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { DATABASE_URL } from "../config/env.js";

const sql = neon(DATABASE_URL);
const dbClient = drizzle({ client: sql });

export default dbClient;
