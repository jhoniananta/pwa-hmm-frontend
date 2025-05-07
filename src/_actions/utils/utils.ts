import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {PWAError} from "@/lib/error";
import {env} from "@/env";

export async function getS3SignedUrl(key: string): Promise<string> {
    const s3Client = new S3Client({
        region: "ap-southeast-3",
        endpoint: "https://s3.ap-southeast-3.amazonaws.com",
    });
    const command = new GetObjectCommand({
        Bucket: 'myhmm-bucket',
        Key: key,
    });
    return await getSignedUrl(s3Client, command, {expiresIn: 10});
}

export function getPublicUrl(path: string): string {
    return `${env.PUBLIC_BUCKET_URL}/${path}`
}

export function fromGMT7ToUTC(date: Date): Date {
    const utcDate = new Date(date);
    utcDate.setHours(utcDate.getHours() - 7);
    return utcDate;
}

export function fromUTCToGMT7(date: Date): Date {
    const gmt7Date = new Date(date);
    gmt7Date.setHours(gmt7Date.getHours() + 7);
    return gmt7Date;
}

export function dateToMinutePrecisionString(date: Date): string {
    return new Date(date).toISOString().split(':').slice(0, 2).join(':')
}

export const getVideoId = (youtubeLink: string) => {
    const match = youtubeLink.match(/[?&]v=([^&]+)/);

    if (!match) {
        throw new PWAError('Invalid YouTube link, the link must contains "?v="');
    }

    return match[1];
};