import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "@/env.mjs";

neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);

// @ts-expect-error
export const db = drizzle(sql, { schema });
