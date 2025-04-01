'use client';

import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { uploadProfileImage } from '@/_actions/upload-image-action';
import { toast } from 'sonner';
import ModalFramer from './modal-framer';
import ModalOverlay from './modal-overlay';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import EditProfile from '@/app/(with-aside)/profile/edit-profile-button';
import { updateAvatar } from '@/_actions/user-action';

type AvatarUploadProps = {
  currentAvatar?: string | null;
  name: string;
};

export default function AvatarUpload({ currentAvatar, name }: AvatarUploadProps) {
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { execute: executeUpdateAvatar } = useAction(updateAvatar, {
    onError: ({ error: { serverError, validationErrors } }) => {
      toast.error(
        serverError || 
        validationErrors?.toString() || 
        'Failed to update profile'
      );
    },
  });

  const { execute: executeUpload, isExecuting } = useAction(uploadProfileImage, {
    onSuccess: async (result) => {
      if (result.data) {
        // Update the user's avatar in the database
        await executeUpdateAvatar({ avatar: result.data });
        toast.success('Profile picture updated successfully');
        router.refresh();
        setShowModal(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    },
    onError: ({ error: { serverError, validationErrors } }) => {
      toast.error(
        serverError || 
        validationErrors?.toString() || 
        'Failed to upload image'
      );
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  return (
    <>
      <div className='bg-navy min-h-[15vh] w-full z-0 relative md:mb-20 mb-16 rounded-t-xl flex justify-end items-center pr-6'>
        <EditProfile />
        <div className='flex items-center justify-center p-1.5 bg-white w-fit rounded-full absolute left-[7.5%] bottom-0 translate-y-1/2'>
          <div className="relative group">
            <Avatar onClick={() => setShowModal(true)} className='md:w-40 md:h-40 h-32 w-32 cursor-pointer'>
              <AvatarImage
                src={currentAvatar ?? ''}
                alt={name}
              />
              <AvatarFallback className='bg-white'>
                {name.split(' ').map((t: string) => t[0])}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <ModalOverlay
            show={showModal}
            setActive={setShowModal}
            setTo={false}
            className='w-screen h-screen top-0 left-0'
          />

          <ModalFramer id="avatar-upload" className="gap-4">
            <h2 className="text-xl font-semibold">Update Profile Picture</h2>

            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-40 h-40">
                <AvatarImage
                  src={previewUrl ?? currentAvatar ?? ''}
                  alt="Preview"
                />
                <AvatarFallback className='bg-white'>
                  {name.split(' ').map((t: string) => t[0])}
                </AvatarFallback>
              </Avatar>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExecuting}
              >
                Select Image
              </Button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                disabled={isExecuting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!selectedFile) return;
                  const formData = new FormData();
                  formData.append('file', selectedFile);
                  executeUpload({
                    file: formData,
                    oldImageUrl: currentAvatar || null
                  });
                }}
                disabled={!selectedFile || isExecuting}
              >
                {isExecuting ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </ModalFramer>
        </>
      )}
    </>
  );
} 