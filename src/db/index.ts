import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const sql = neon(
  process.env.DATABASE_URL ||
    //   work around for requiring dbUrl in CI pipeline
    "postgresql://username:pass@ep-tethered-smoke-d1fk42jf.ap-southeast-1.aws.neon.tech/db?sslmode=require"
);

// @ts-expect-error
export const db = drizzle(sql, { schema });
