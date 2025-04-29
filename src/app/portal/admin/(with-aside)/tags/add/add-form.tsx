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
import {createTag} from "@/_actions/tag-action";
import {addTagSchema} from "@/_actions/schema/tag-schema";
import {PWAError} from "@/lib/error";
import {createSafeActionClient} from "next-safe-action";

function AddForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof addTagSchema>>({
        resolver: zodResolver(addTagSchema),
        defaultValues: {
            title: '',
        },
    });

    const {execute, status} = useAction(createTag, {
        onSuccess: (result) => {
            const data: any = result.data
            if (data && data?.isError) {
                toast.error(data?.message)
                return;
            }
            toast.success('Tag created!')
            router.push('/portal/admin/tags');
        },
        onError: () => {
            toast.error('Failed to add tag!')
        },
    });

    const onSubmit = handleSubmit((data) => {
        execute(data);
    });

    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            <div>
                <Label>Title</Label>
                <Input {...register('title')} placeholder="Enter tag title"/>
                {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
            </div>

            <Button
                type='submit'
                className='bg-navy mt-6'
                disabled={status === 'executing'}
            >
                {status === 'executing' ? 'Adding...' : 'Add Tag'}
            </Button>
        </form>
    );
}

export default AddForm; 