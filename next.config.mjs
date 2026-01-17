import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},
    serverExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt"],
    images: {
        remotePatterns: [
            {
                hostname: "lh3.googleusercontent.com",
                protocol: "https"
            }
        ]
    }
};

export default nextConfig;
