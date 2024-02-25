import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import dotEnv from "dotenv";

dotEnv.config();

const runMigrate = async () => {
  neonConfig.fetchConnectionCache = true;

  const sql = neon(process.env.DATABASE_URL!);
  //   @ts-expect-error
  const db = drizzle(sql);

  console.log("⏳ Running migrations...");
  const start = Date.now();

  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
