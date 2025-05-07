import {createEnv} from "@t3-oss/env-nextjs"
import {z} from 'zod'

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
        YOUTUBE_API_SECRET_KEY: z.string(),
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
        NEXT_PUBLIC_VAPID_PRIVATE_KEY: z.string(),
        R2_ACCESS_KEY_ID: z.string(),
        R2_SECRET_ACCESS_KEY: z.string(),
        R2_ACCOUNT_ID: z.string(),
        BUCKET_NAME: z.string(),
        PUBLIC_BUCKET_NAME: z.string(),
        PUBLIC_BUCKET_URL: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_SECRET: process.env.AUTH_SECRET,
        SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
        API_URL: process.env.API_URL,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
        YOUTUBE_API_SECRET_KEY: process.env.YOUTUBE_API_SECRET_KEY,
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        NEXT_PUBLIC_VAPID_PRIVATE_KEY: process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        BUCKET_NAME: process.env.BUCKET_NAME,
        PUBLIC_BUCKET_NAME: process.env.PUBLIC_BUCKET_NAME,
        PUBLIC_BUCKET_URL: process.env.PUBLIC_BUCKET_URL,
    },
    emptyStringAsUndefined: true,
})