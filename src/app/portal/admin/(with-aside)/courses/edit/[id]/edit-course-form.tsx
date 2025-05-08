'use client';
import React, {useRef, useState} from 'react';

import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import {useParams, useRouter} from 'next/navigation';
import Wrapper from '../../../../wrapper';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {updateCourseSchema} from '@/lib/schema';
import {z} from 'zod';
import {useAction} from 'next-safe-action/hooks';
import {addCategoryCourse, deleteCategoryCourse, updateCourse} from '@/_actions/courses-action';
import {uploadCourseImage} from '@/_actions/upload-image-action';
import {toast} from 'sonner';
import Image from 'next/image';
import ManageTable from '@/app/portal/admin/manage-table';
import {TableCell, TableRow} from '@/components/ui/table';
import Link from 'next/link';
import {MinusSquare, Pencil, PlusSquare} from 'lucide-react';
import {CategoryResponse} from '@/_actions/category-action';
import validationErrorToString from "@/lib/validationErrorToString";

type EditCourseFormProps = {
    categories: CategoryResponse[];
    defaultValues?: z.infer<typeof updateCourseSchema>;
    publicBucketUrl: string;
};

export default function EditCourseForm({
                                           categories,
                                           defaultValues,
                                           publicBucketUrl
                                       }: EditCourseFormProps) {
    const {id} = useParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        `${publicBucketUrl}/${defaultValues?.image}`
    );

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof updateCourseSchema>>({
        resolver: zodResolver(updateCourseSchema),
        defaultValues,
    });

    const {execute: executeUpload, isExecuting: isUploading} = useAction(
        uploadCourseImage,
        {
            onSuccess: (response: any) => {
                if (response?.data.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Image uploaded successfully');
            },
            onError: (error) => {
                toast.error(error.error?.serverError || 'Failed to upload image');
            },
        }
    );

    const {execute: executeUpdateCourse, isExecuting} = useAction(
        updateCourse,
        {
            onSuccess: (response: any) => {
                if (response?.data.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Course updated successfully');
                router.push('/portal/admin/courses');
            },
            onError: ({error: {validationErrors}}) => {
                toast.error(
                    validationErrorToString(validationErrors) ||
                    'Failed to update course'
                );
            },
        }
    );

    const {execute: executeAddCategory, isExecuting: isAddingCategories} =
        useAction(addCategoryCourse, {
            onSuccess: (response: any) => {
                if (response?.data.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Category added successfully!');
            },
            onError: ({error}) => {
                toast.error(
                    String(
                        error.serverError || error.fetchError || 'Failed to add category.'
                    )
                );
            },
        });

    const {execute: executeDeleteCategory, isExecuting: isDeletingCategories} =
        useAction(deleteCategoryCourse, {
            onSuccess: (response: any) => {
                if (response?.data.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Category deleted successfully!');
            },
            onError: ({error}) => {
                toast.error(
                    String(
                        error.serverError ||
                        error.fetchError ||
                        'Failed to delete category.'
                    )
                );
            },
        });

    const handleAddCategory = (categoryId: number) => {
        executeAddCategory({
            courseId: defaultValues?.courseId,
            categoryId,
        });
    };

    const handleRemoveCategory = (categoryId: number) => {
        executeDeleteCategory({
            courseId: defaultValues?.courseId,
            categoryId,
        });
    };

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Upload
        const formData = new FormData();
        formData.append('file', file);
        executeUpload({
            file: formData,
            path: defaultValues?.image,
        });
    };

    const onSubmit = handleSubmit((data) => {
        const {categories, categoryId, ...restData} = data
        executeUpdateCourse(restData);
    });

    return (
        <>
            <AdminHeader title='Edit Course'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <form className='space-y-4' onSubmit={onSubmit}>
                    <div>
                        <Label>Code</Label>
                        <Input {...register('code')} />
                        {errors.code && (
                            <span className='text-red-500 text-sm'>
                {errors.code.message}
              </span>
                        )}
                    </div>

                    <div>
                        <Label>Image</Label>
                        <div className='flex flex-col gap-4'>
                            {previewUrl && (
                                <div className='relative w-40 h-40'>
                                    <Image
                                        unoptimized={true}
                                        src={previewUrl}
                                        alt='Preview'
                                        fill
                                        className='object-cover rounded-lg'
                                    />
                                </div>
                            )}
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleFileSelect}
                                ref={fileInputRef}
                                className='hidden'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => fileInputRef.current?.click()}
                                className='w-fit'
                                disabled={isUploading || isExecuting}
                            >
                                Choose Image
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label>Title</Label>
                        <Input {...register('title')} />
                        {errors.title && (
                            <span className='text-red-500 text-sm'>
                {errors.title.message}
              </span>
                        )}
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea {...register('description')} rows={5}/>
                        {errors.description && (
                            <span className='text-red-500 text-sm'>
                {errors.description.message}
              </span>
                        )}
                    </div>

                    {/* Categories select */}
                    <div>
                        <Label>Available Categories</Label>
                        <div className='mt-2 space-y-2 rounded-md border p-4'>
                            {categories.length ? (
                                categories.map((categories: CategoryResponse) => {
                                    const selected =
                                        Array.isArray(defaultValues?.categories) &&
                                        defaultValues.categories.includes(categories.categoryId);

                                    return (
                                        <div
                                            key={categories.categoryId}
                                            className='flex items-center justify-between'
                                        >
                                            <span>{categories.title}</span>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    selected
                                                        ? handleRemoveCategory(categories.categoryId)
                                                        : handleAddCategory(categories.categoryId)
                                                }
                                                disabled={isAddingCategories || isDeletingCategories}
                                                aria-label={
                                                    selected
                                                        ? `Remove tag ${categories.title}`
                                                        : `Add tag ${categories.title}`
                                                }
                                            >
                                                {selected ? (
                                                    <MinusSquare className='h-5 w-5 text-red-500'/>
                                                ) : (
                                                    <PlusSquare className='h-5 w-5 text-green-500'/>
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
                        className='bg-navy'
                        disabled={isUploading || isExecuting}
                    >
                        {isUploading
                            ? 'Uploading...'
                            : isExecuting
                                ? 'Updating...'
                                : 'Update Course'}
                    </Button>
                </form>
            </Wrapper>
            <Wrapper>
                <h2 className='text-lg font-semibold mb-4'>Manage Course</h2>
                <ManageTable>
                    {['lessons', 'classes', 'schedules'].map((item, i) => (
                        <TableRow
                            key={item + '-edit-course-admin-page'}
                            className='even:bg-abu-1 odd:bg-white'
                        >
                            <TableCell className='capitalize font-semibold '>
                                {item}
                            </TableCell>
                            <TableCell className='flex justify-end'>
                                <Link
                                    href={`/portal/admin/courses/${id}/${item}`}
                                    className='text-blue-500 flex gap-2 items-center'
                                >
                                    <Pencil className='w-4 h-4'/>
                                    Manage
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </ManageTable>
            </Wrapper>
        </>
    );
}