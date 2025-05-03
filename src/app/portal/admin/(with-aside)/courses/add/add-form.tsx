'use client';

import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import ErrorText from '../../../error-text';
import {addCourseSchema} from '@/lib/schema';
import {createCourse} from '@/_actions/courses-action';
import {CourseCategoryModel} from 'lms-types';
import {useRef, useState} from 'react';
import {uploadCourseImage} from '@/_actions/upload-image-action';
import Image from 'next/image';
import { MinusSquare, PlusSquare } from 'lucide-react';

type FormData = z.infer<typeof addCourseSchema>;

interface AddFormProps {
    initialCategories: CourseCategoryModel[];
}

function AddForm({initialCategories}: AddFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        getValues
    } = useForm<FormData>({
        resolver: zodResolver(addCourseSchema),
        defaultValues: {
            code: '',
            image: '',
            title: '',
            description: '',
        },
    });

    const {execute: executeAddCourse, status} = useAction(createCourse, {
        onSuccess: () => {
            toast.success('Course added successfully');
            router.push('/portal/admin/courses');
        },
        onError: (error) => {
            toast.error(error.error?.serverError || 'Failed to add course');
        },
    });

    const selectedCategories: CourseCategoryModel[] = (watch('categories') || []).map(
        (categoryId: number) => initialCategories.find((categories) => categories.categoryId === categoryId) as CourseCategoryModel
    );

    // Add categories to form
    const addCategories = (categories: CourseCategoryModel) => {
        const updatedCategories = selectedCategories.filter(
            (selectedCategories) => selectedCategories.categoryId !== categories.categoryId
        );
        setValue('categories', updatedCategories.map((category) => category.categoryId));
        toast.success('Category added successfully');
    };

    const removeCategories = (categories: CourseCategoryModel) => {
        const updatedCategories = selectedCategories.filter(
          (selectedCategories) => selectedCategories.categoryId !== categories.categoryId
        );
        setValue(
          'categories',
          updatedCategories.map((category) => category.categoryId)
        );
        toast.success(`Tag "${categories.title}" removed`);
      };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {execute: executeUpload} = useAction(uploadCourseImage, {
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
            categories: selectedCategories.map((category) => ({
                categoryId: category.categoryId,
                title: category.title,
              })),
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
                                unoptimized={true}
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

            {/* <div>
                <Label>Category</Label>
                <Select
                    onValueChange={(value) => setValue('categoryId', Number(value))}
                >
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        {initialCategories.map((category) => (
                            <SelectItem key={category.categoryId} value={String(category.categoryId)}>
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && <ErrorText>{errors.categoryId.message}</ErrorText>}
            </div> */}

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

            <div>
          <Label>Available Tags</Label>
          <div className='mt-2 space-y-2 border p-4 rounded-md'>
            {initialCategories.length > 0 ? (
              initialCategories.map((categories: CourseCategoryModel, index) => {
                const isSelected = selectedCategories.some(
                  (selectedCategories) => selectedCategories.categoryId === categories.categoryId
                );
                return (
                  <div
                    key={`${categories.categoryId}-${index}`} // Ensure uniqueness by appending the index
                    className='flex justify-between items-center'
                  >
                    <span>{categories.title}</span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        isSelected ? removeCategories(categories) : addCategories(categories);
                      }}
                      aria-label={
                        isSelected ? `Remove ${categories.title}` : `Add ${categories.title}`
                      }
                    >
                      {isSelected ? (
                        <MinusSquare className='h-5 w-5 text-red-500' />
                      ) : (
                        <PlusSquare className='h-5 w-5 text-green-500' />
                      )}
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className='text-sm text-muted-foreground'>
                No categories available.
              </p>
            )}
          </div>
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
