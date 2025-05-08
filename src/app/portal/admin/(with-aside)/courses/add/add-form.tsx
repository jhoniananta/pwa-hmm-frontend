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

function AddForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        getValues
    } = useForm<z.infer<typeof addCourseSchema>>({
        resolver: zodResolver(addCourseSchema),
        defaultValues: {
            code: '',
            image: '',
            title: '',
            description: '',
        },
    });

    const {execute: executeAddCourse, status} = useAction(createCourse, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Course added successfully');
            router.push(`/portal/admin/courses/edit/${response?.data?.courseId ?? ''}`);
        },
        onError: (error) => {
            toast.error(error.error?.serverError || 'Failed to add course');
        },
    });

    const onSubmit = handleSubmit((data) => {
        router.push(`/portal/admin/courses/edit`);

        data.image = `courses/${crypto.randomUUID()}`
        executeAddCourse(data);
    });

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
                <Label>Title</Label>
                <Input
                    id='title'
                    {...register('title')}
                />
                {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
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
