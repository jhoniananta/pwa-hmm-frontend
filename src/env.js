import {createEnv} from "@t3-oss/env-nextjs"
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    AUTH_SECRET: z.string(),
    SESSION_MAX_AGE: z.preprocess(
      (str) => (str ? parseInt(str) : 24 * 60 * 60 * 1000),
      z.number().int().positive().min(1),
    ),
    API_URL: z.string(),
    BLOB_READ_WRITE_TOKEN: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
    API_URL: process.env.API_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
  emptyStringAsUndefined: true,
})