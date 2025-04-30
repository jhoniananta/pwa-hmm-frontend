import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

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