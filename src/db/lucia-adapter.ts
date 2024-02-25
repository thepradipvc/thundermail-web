import { env } from "@/env.mjs";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);

// @ts-expect-error
export const db = drizzle(sql, { schema });

export const adapter: DrizzlePostgreSQLAdapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users
);
