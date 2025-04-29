'use client';
import React from 'react';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import {useParams, useSearchParams} from 'next/navigation';
import Wrapper from '../../../../wrapper';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {updateCategorySchema} from "@/_actions/schema/category-schema";
import {updateCategory} from "@/_actions/category-action";

export default function Page() {
    const {id} = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const defaultValues = {
        categoryId: Number(id),
        title: searchParams.get('title') || '',
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof updateCategorySchema>>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues,
    });

    const {execute, status} = useAction(updateCategory, {
        onSuccess: (result) => {
            const data: any = result.data
            if (data && data?.isError) {
                toast.error(data?.message)
                return;
            }
            toast.success('Category updated!')
            router.push('/portal/admin/categories');
        },
        onError: () => {
            toast.error('Failed to update category!')
        },
    });

    const onSubmit = handleSubmit((data) => {
        execute(data);
    });

    return (
        <>
            <AdminHeader title='Edit Category'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <form onSubmit={onSubmit} className='space-y-4'>
                    <div>
                        <Label>Title</Label>
                        <Input {...register('title')} />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>

                    <Button type='submit' className='bg-navy' disabled={status === 'executing'}>
                        {status === 'executing' ? 'Updating...' : 'Update Category'}
                    </Button>
                </form>
            </Wrapper>
        </>
    );
} 