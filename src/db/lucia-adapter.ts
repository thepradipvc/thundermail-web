import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const sql = neon(
  process.env.DATABASE_URL ||
    //   work around for requiring dbUrl in CI pipeline
    "postgresql://username:pass@ep-tethered-smoke-d1fk42jf.ap-southeast-1.aws.neon.tech/db?sslmode=require"
);

// @ts-expect-error
export const db = drizzle(sql, { schema });

export const adapter: DrizzlePostgreSQLAdapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users
);
