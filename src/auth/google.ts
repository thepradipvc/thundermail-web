import { env } from "@/env.mjs";
import { Google } from "arctic";

export const google = new Google(
  env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);
