import { z } from 'zod';

export const maxFileUploadTypeSize = (options: {
  allowedTypes: string[];
  maxSizeInMB: number;
}) =>
  z
    .union([
      // Case 1: File object from input
      z
        .instanceof(File, { message: 'File is required' })
        .refine(
          (file) => {
            const type = file.type.toLowerCase();
            const ext = file.name.split('.').pop()?.toLowerCase() || '';

            return (
              options.allowedTypes.includes(type) ||
              options.allowedTypes.includes(ext)
            );
          },
          {
            message: `File must be one of: ${options.allowedTypes.join(', ')}`,
          }
        )
        .refine((file) => file.size <= options.maxSizeInMB * 1024 * 1024, {
          message: `File must be smaller than ${options.maxSizeInMB}MB`,
        }),

      // Case 2: file path string (from session storage or uploaded previously)
      z
        .string()
        .min(1, { message: 'File is required' })
        .refine(
          (val) => {
            const ext = val.split('.').pop()?.toLowerCase() ?? '';
            const allowedExts = options.allowedTypes
              .map((t) => (t.includes('/') ? t.split('/').pop() : t))
              .filter(Boolean);

            return allowedExts.includes(ext);
          },
          {
            message: 'Uploaded file is invalid or has unsupported extension',
          }
        ),
    ])
    .optional(); // <- make it optional if not always required
