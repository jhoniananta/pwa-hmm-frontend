'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ErrorText from '../../../error-text';
import { addCourseSchema } from '@/lib/schema';
import { createCourse } from '@/_actions/courses-action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCategoryModel } from 'lms-types';
import { useRef, useState } from 'react';
import { uploadCourseImage } from '@/_actions/upload-image-action';
import Image from 'next/image';

type FormData = z.infer<typeof addCourseSchema>;

interface AddFormProps {
  initialCategories: CourseCategoryModel[];
}

function AddForm({ initialCategories }: AddFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      status: undefined,
      categoryId: "",
      description: '',
      image: "",
    },
  });

  const { execute: executeAddCourse, status } = useAction(createCourse, {
    onSuccess: () => {
      toast.success('Course added successfully');
      router.push('/portal/admin/courses');
    },
    onError: (error) => {
      toast.error(error.error?.serverError || 'Failed to add course');
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { execute: executeUpload } = useAction(uploadCourseImage, {
    onSuccess: (result) => {
      if (result?.data) {
        setValue('image', result.data);
        setPreviewUrl(result.data);
        toast.success('Image uploaded successfully');
      }
    },
    onError: (error) => {
      toast.error(error.error?.serverError || 'Failed to upload image');
    },
  });

  const onSubmit = handleSubmit((data) => {
    // Convert categoryId to number if it exists
    const formData = {
      ...data,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined
    };
    executeAddCourse(formData);
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload
    const formData = new FormData();
    formData.append('file', file);
    await executeUpload({ 
      file: formData,
      oldImageUrl: getValues('image') || null 
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className='space-y-4'
    >
      <div>
        <Label>Code</Label>
        <Input
          id='code'
          {...register('code')}
        />
        {errors.code && <ErrorText>{errors.code.message}</ErrorText>}
      </div>

      <div>
        <Label>Image</Label>
        <div className="flex flex-col gap-4">
          {previewUrl && (
            <div className="relative w-40 h-40">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className='w-fit'
          >
            Choose Image
          </Button>
        </div>
        {errors.image && <ErrorText>{errors.image.message}</ErrorText>}
      </div>

      <div>
        <Label>Title</Label>
        <Input
          id='title'
          {...register('title')}
        />
        {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
      </div>

      <div>
        <Label>Status</Label>
        <Select
          onValueChange={(value) =>
            setValue('status', value as 'PUBLISHED' | 'DRAFT')
          }
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='PUBLISHED'>Published</SelectItem>
            <SelectItem value='DRAFT'>Draft</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <ErrorText>{errors.status.message}</ErrorText>}
      </div>

      <div>
        <Label>Category</Label>
        <Select
          onValueChange={(value) => setValue('categoryId', Number(value))}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            {initialCategories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <ErrorText>{errors.categoryId.message}</ErrorText>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          id='description'
          rows={5}
          {...register('description')}
        />
        {errors.description && (
          <ErrorText>{errors.description.message}</ErrorText>
        )}
      </div>

      <Button
        type='submit'
        className='bg-navy mt-6'
        disabled={status === 'executing'}
      >
        {status === 'executing' ? 'Adding...' : 'Add Course'}
      </Button>
    </form>
  );
}

export default AddForm;
