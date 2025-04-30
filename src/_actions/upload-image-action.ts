'use server';

import {del, put} from '@vercel/blob';
import {actionClient} from '@/lib/action-client';
import {z} from 'zod';
import {flattenValidationErrors} from 'next-safe-action';
import {handleError, PWAError} from '@/lib/error';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import axios from 'axios';
import {verifySession} from "@/lib/session";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const uploadImageSchema = z.object({
    file: z.instanceof(FormData)
});

const deleteOldFile = async (oldUrl: string | null) => {
    if (!oldUrl) return;

    try {
        await del(oldUrl);
    } catch (error) {
        console.error('Failed to delete old file:', error);
    }
};

export const uploadProfileImage = actionClient
    .metadata({
        actionName: 'uploadProfileImage'
    })
    .schema(z.object({
        file: z.instanceof(FormData),
    }))
    .action(async ({parsedInput}) => {
        try {
            const file = parsedInput.file.get('file') as File;
            if (!file) {
                throw new Error('No file provided');
            }

            const session = await verifySession();
            const key = `profiles/${session.userId}`


            const s3Client = new S3Client({
                region: "ap-southeast-3",
                endpoint: "https://s3.ap-southeast-3.amazonaws.com",
            });
            const command = new PutObjectCommand({
                Bucket: "myhmm-bucket",
                Key: key,
                ContentType: file.type,
            });

            const uploadUrl = await getSignedUrl(s3Client, command, {expiresIn: 10});

            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            return key;
        } catch (error) {
            if (error instanceof PWAError) {
                throw error;
            }
            throw new PWAError();
        }
    })

// Modify the course image upload action
export const uploadCourseImage = actionClient
    .metadata({
        actionName: 'uploadCourseImage',
    })
    .schema(z.object({
        file: z.instanceof(FormData),
        oldImageUrl: z.string().nullable().optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({parsedInput}) => {
        try {
            const file = parsedInput.file.get('file') as File;
            if (!file) {
                throw new Error('No file provided');
            }

            // First upload the new file
            const pathname = `courses/${Date.now()}-${file.name}`;
            const {url} = await put(pathname, file, {
                access: 'public',
            });

            // Only delete the old file if new upload succeeded
            if (parsedInput.oldImageUrl) {
                await deleteOldFile(parsedInput.oldImageUrl);
            }

            return url;
        } catch (error) {
            handleError(error);
        }
    });

// Update scholarship image upload to match the pattern
export const uploadScholarshipImage = actionClient
    .metadata({
        actionName: 'uploadScholarshipImage',
    })
    .schema(z.object({
        file: z.instanceof(FormData),
        oldImageUrl: z.string().nullable().optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({parsedInput}) => {
        try {
            const file = parsedInput.file.get('file') as File;
            if (!file) {
                throw new Error('No file provided');
            }

            // First upload the new file
            const pathname = `scholarships/${Date.now()}-${file.name}`;
            const {url} = await put(pathname, file, {
                access: 'public',
            });

            // Only delete the old file if new upload succeeded
            if (parsedInput.oldImageUrl) {
                await deleteOldFile(parsedInput.oldImageUrl);
            }

            return url;
        } catch (error) {
            handleError(error);
        }
    });

// Add this new action for PDF uploads
export const uploadPDF = actionClient
    .metadata({
        actionName: 'uploadPDF',
    })
    .schema(uploadImageSchema, {
        handleValidationErrorsShape: async (ve) =>
            Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({parsedInput}) => {
        try {
            const file = parsedInput.file.get('file') as File;
            if (!file) {
                throw new Error('No file provided');
            }

            // Validate file type
            if (!file.type.includes('pdf')) {
                throw new Error('File must be a PDF');
            }

            // Generate a unique pathname with timestamp to avoid collisions
            const pathname = `pdfs/${Date.now()}-${file.name}`;

            const {url} = await put(pathname, file, {
                access: 'public',
                contentType: 'application/pdf',
            });

            return url;
        } catch (error) {
            handleError(error);
        }
    });

// Add a more generic document upload action that accepts multiple file types
export const uploadDocument = actionClient
    .metadata({
        actionName: 'uploadDocument',
    })
    .schema(z.object({
        file: z.instanceof(FormData),
        allowedTypes: z.array(z.string()).optional(),
        folder: z.string().optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({parsedInput}) => {
        try {
            const file = parsedInput.file.get('file') as File;
            if (!file) {
                throw new Error('No file provided');
            }

            // Validate file type if allowedTypes is provided
            if (parsedInput.allowedTypes && !parsedInput.allowedTypes.includes(file.type)) {
                throw new Error(`File type must be one of: ${parsedInput.allowedTypes.join(', ')}`);
            }

            // Use provided folder or default to 'documents'
            const folder = parsedInput.folder || 'documents';
            const pathname = `${folder}/${Date.now()}-${file.name}`;

            const {url} = await put(pathname, file, {
                access: 'public',
                contentType: file.type,
            });

            return url;
        } catch (error) {
            handleError(error);
        }
    });

