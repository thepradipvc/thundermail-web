import { ThunderMail } from "thundermail";

export const thundermail = new ThunderMail(
  // Dummy API key for CI/CD
  process.env.THUNDERMAIL_API_KEY || "tim_123",
);
