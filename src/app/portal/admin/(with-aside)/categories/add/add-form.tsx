'use client';

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import ErrorText from '@/app/portal/admin/error-text';
import {Button} from '@/components/ui/button';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useRouter} from 'next/navigation';
import {createCategory} from "@/_actions/category-action";
import {addCategorySchema} from "@/_actions/schema/category-schema";

function AddForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof addCategorySchema>>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: {
            title: '',
        },
    });

    const {execute, status} = useAction(createCategory, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Category created!')
            router.push('/portal/admin/categories');
        },
        onError: () => {
            toast.error('Failed to create category!')
        },
    });

    const onSubmit = handleSubmit((data) => {
        execute(data);
    });

    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            <div>
                <Label>Title</Label>
                <Input {...register('title')} placeholder="Enter category title"/>
                {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
            </div>

            <Button
                type='submit'
                className='bg-navy mt-6'
                disabled={status === 'executing'}
            >
                {status === 'executing' ? 'Adding...' : 'Add Category'}
            </Button>
        </form>
    );
}

export default AddForm; 