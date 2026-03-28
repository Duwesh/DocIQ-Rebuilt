import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Ensure variables are loaded even in CLI context
config();
config({ path: ".env", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
