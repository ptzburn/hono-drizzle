import { drizzle } from "drizzle-orm/node-postgres";
import "jsr:@std/dotenv/load";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: Deno.env.get("DATABASE_URL")!,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, { casing: "snake_case" });
