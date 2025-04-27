'use client';

import React, { useCallback, useState } from 'react';

import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { FaRegFile } from 'react-icons/fa';
import { MdOutlineFileUpload } from 'react-icons/md';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export type UploadFileProps = {
  sessionIdName: string;
  accept?: Accept;
  maxSizeInBytes?: number;
  onChange?: (file: File) => void;
};

const UploadFile = React.forwardRef<HTMLDivElement, UploadFileProps>(
  ({ sessionIdName, accept = {}, maxSizeInBytes, onChange }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { setValue, setError, clearErrors } = useFormContext();
    const {
      formState: { errors },
    } = useFormContext();

    const formError = errors[sessionIdName];

    const onDrop = useCallback(
      async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
          const firstError = fileRejections[0].errors[0];
          let errorMessage = '';

          console.error('File upload error:', firstError);

          if (firstError.code === 'file-too-large') {
            const sizeInMB = (maxSizeInBytes || 0) / 1000000;
            errorMessage = `File is larger than ${sizeInMB}MB`;
            setError(sessionIdName, {
              type: 'manual',
              message: errorMessage,
            });
          } else if (firstError.code === 'file-invalid-type') {
            errorMessage = 'Invalid filetype. Please upload a valid file.';
            setError(sessionIdName, {
              type: 'manual',
              message: errorMessage,
            });
          } else {
            errorMessage = firstError.message || 'Upload error';
            setError(sessionIdName, {
              type: 'manual',
              message: errorMessage,
            });
          }

          setSelectedFile(null);
          setValue(sessionIdName, null, { shouldValidate: true });

          toast.error(errorMessage || 'Gagal mengirim data');

          return;
        }

        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          setSelectedFile(file);
          setValue(sessionIdName, file, { shouldValidate: true });
          clearErrors(sessionIdName);
          onChange?.(file);
        }
      },
      [onChange, maxSizeInBytes, setValue, clearErrors, setError, sessionIdName]
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: maxSizeInBytes,
      accept,
      multiple: false,
    });

    const formatAcceptList = (accept?: Accept): string | null => {
      if (!accept) return null;
      const exts = Object.keys(accept).map((type) => {
        const parts = type.split('/');
        return parts.length === 2 ? `.${parts[1]}` : type;
      });
      return exts.join(', ');
    };

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className={twMerge(
          'bg-white hover:bg-gray-100 active:bg-gray-300 relative flex cursor-pointer flex-col items-center justify-center rounded-md px-4 py-6 text-center text-sm transition-colors border-solid border-2 border-gray-200',
          formError && 'border-destructive text-black bg-[#EF3C2D33]'
        )}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className='flex items-center gap-6'>
            <FaRegFile className='text-black mb-1 text-2xl' />
            <div className='flex flex-col gap-1'>
              <p className='text-black text-[16px] font-medium'>
                {selectedFile.name}
              </p>
              <p className='text-black text-xs'>
                {(selectedFile.size / 1_000_000).toFixed(1)} MB
              </p>
            </div>
          </div>
        ) : (
          <>
            <MdOutlineFileUpload className='text-black mb-1 text-2xl' />
            <p className='text-black text-sm font-medium'>
              {typeof formError?.message === 'string'
                ? formError.message
                : 'Click or drag & drop to upload'}
            </p>

            {(accept || maxSizeInBytes) && (
              <p className='text-black pt-2 text-xs'>
                {accept && (
                  <>
                    Supported files: {formatAcceptList(accept)}
                    {maxSizeInBytes ? ' and ' : ''}
                  </>
                )}
                {maxSizeInBytes && (
                  <>Max size: {(maxSizeInBytes / 1_000_000).toFixed(1)}MB</>
                )}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
);

UploadFile.displayName = 'UploadFile';
export default UploadFile;
