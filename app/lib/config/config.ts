import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.preprocess((val) => Number(val), z.number()),
});

const env = envSchema.parse(process.env);

export { env };
