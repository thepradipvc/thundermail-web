const { createCipheriv, randomBytes, createDecipheriv } = require("crypto");

export const encrypt = (text: string, secretKey: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText: string, secretKey: string) => {
  const [ivString, encryptedData] = encryptedText.split(":");
  const iv = Buffer.from(ivString, "hex");
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
