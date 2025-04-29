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
import {updateTagSchema} from "@/_actions/schema/tag-schema";
import {updateTag} from "@/_actions/tag-action";

export default function Page() {
    const {id} = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const defaultValues = {
        tagId: Number(id),
        title: searchParams.get('title') || '',
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof updateTagSchema>>({
        resolver: zodResolver(updateTagSchema),
        defaultValues,
    });

    const {execute: executeUpdateTag, status} = useAction(updateTag, {
        onSuccess: (result) => {
            const data: any = result.data
            if (data && data?.isError) {
                toast.error(data?.message)
                return;
            }
            toast.success('Tag updated!')
            router.push('/portal/admin/tags');
        },
        onError: () => {
            toast.error('Failed to update tag!')
        },
    });

    const onSubmit = handleSubmit((data) => {
        executeUpdateTag(data);
    });

    return (
        <>
            <AdminHeader title='Edit Tag'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <form onSubmit={onSubmit} className='space-y-4'>
                    <div>
                        <Label>Title</Label>
                        <Input {...register('title')} />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>

                    <Button type='submit' className='bg-navy' disabled={status === 'executing'}>
                        {status === 'executing' ? 'Updating...' : 'Update Tag'}
                    </Button>
                </form>
            </Wrapper>
        </>
    );
} 