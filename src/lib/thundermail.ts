import { ThunderMail } from "thundermail";

export const thundermail = new ThunderMail(process.env.THUNDERMAIL_API_KEY);
