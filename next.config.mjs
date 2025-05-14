/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const config = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
})({
    env: {
        YOUTUBE_API_SECRET_KEY: process.env.YOUTUBE_API_SECRET_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AUTH_SECRET: process.env.AUTH_SECRET,
        SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
        API_URL: process.env.API_URL,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                pathname: '/vi/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'climate.onep.go.th',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '5jvbbvqqbhhtsyec.public.blob.vercel-storage.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i9.ytimg.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
                pathname: '/**',
            },
        ],
    },
});

export default config;
