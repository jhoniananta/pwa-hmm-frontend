'use server';

import { put, del } from '@vercel/blob';
import { actionClient } from '@/lib/action-client';
import { z } from 'zod';
import { flattenValidationErrors } from 'next-safe-action';
import { handleError } from '@/lib/error';

// Change the schema to accept FormData instead of File
const uploadImageSchema = z.object({
  file: z.instanceof(FormData)
});

// Add this new function to delete old files
const deleteOldFile = async (oldUrl: string | null) => {
  if (!oldUrl) return;

  try {
    await del(oldUrl);
  } catch (error) {
    console.error('Failed to delete old file:', error);
  }
};

// Modify the profile image upload action
export const uploadProfileImage = actionClient
  .metadata({
    actionName: 'uploadProfileImage',
  })
  .schema(z.object({
    file: z.instanceof(FormData),
    oldImageUrl: z.string().nullable().optional(),
  }), {
    handleValidationErrorsShape: async (ve) =>
      Promise.resolve(flattenValidationErrors(ve).fieldErrors),
  })
  .action(async ({ parsedInput }) => {
    try {
      const file = parsedInput.file.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      // First upload the new file
      const pathname = `profiles/${Date.now()}-${file.name}`;
      const { url } = await put(pathname, file, {
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
  .action(async ({ parsedInput }) => {
    try {
      const file = parsedInput.file.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      // First upload the new file
      const pathname = `courses/${Date.now()}-${file.name}`;
      const { url } = await put(pathname, file, {
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
  .action(async ({ parsedInput }) => {
    try {
      const file = parsedInput.file.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }

      // First upload the new file
      const pathname = `scholarships/${Date.now()}-${file.name}`;
      const { url } = await put(pathname, file, {
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
  .action(async ({ parsedInput }) => {
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
      
      const { url } = await put(pathname, file, {
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
  .action(async ({ parsedInput }) => {
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
      
      const { url } = await put(pathname, file, {
        access: 'public',
        contentType: file.type,
      });

      return url;
    } catch (error) {
      handleError(error);
    }
  });

