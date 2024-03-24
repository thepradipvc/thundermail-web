import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string().url(),
  AWS_SQS_QUEUE_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  TOKENS_ENCRYPTION_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
});

const env = envVariables.safeParse(process.env);

if (!env.success) {
  missingEnvVariableError(env.error.errors);
}

type EnvVariables = z.infer<typeof envVariables>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}

function missingEnvVariableError(errors: z.ZodIssue[]) {
  console.log("===========================================");
  console.error("Missing Environment Variables:");
  for (const error of errors) {
    console.log(error.path[0]);
  }
  console.log("===========================================");
}
