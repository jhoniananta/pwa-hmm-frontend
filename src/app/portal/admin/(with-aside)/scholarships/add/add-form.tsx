'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import Wrapper from '../../../wrapper';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import ErrorText from '@/app/portal/admin/error-text';

import {addScholarshipSchema} from '@/lib/schema';
import {createScholarship} from '@/_actions/scholarship-action';
import {TagResponse} from '@/_actions/tag-action';
import {useAction} from 'next-safe-action/hooks';
import {z} from 'zod';
import {dateToMinutePrecisionString, fromUTCToGMT7} from "@/_actions/utils/utils";

type AddFormProps = {
    tags: TagResponse[];
};

export default function AddForm({tags}: AddFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
    } = useForm<z.infer<typeof addScholarshipSchema>>({
        resolver: zodResolver(addScholarshipSchema),
        defaultValues: {
            image: '',
            title: '',
            provider: '',
            deadline: dateToMinutePrecisionString(fromUTCToGMT7(new Date())),
            reference: '',
            description: '',
        },
    });

    const {execute: execCreate, isExecuting: creating} = useAction(
        createScholarship,
        {
            onSuccess: (response: any) => {
                if (response?.data?.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Scholarship created');
                router.push(`/portal/admin/scholarships/edit/${response?.data?.scholarshipId}`);
            },
            onError: ({error: {serverError, validationErrors, fetchError}}) => {
                console.log(
                    'API error: ',
                    serverError || fetchError || validationErrors?.toString()
                );
                toast.error(
                    serverError ||
                    fetchError ||
                    validationErrors?.toString() ||
                    'Failed to create scholarship'
                );
            },
        }
    );

    const onSubmit = handleSubmit((data) => {
        data.image = `scholarships/${crypto.randomUUID()}`

        const payload = {
            ...data,
        };

        execCreate(payload);
    });

    return (
        <Wrapper>
            <form onSubmit={onSubmit} className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input {...register('title')} placeholder='Enter scholarship title'/>
                    {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
                </div>
                <div>
                    <Label>Provider</Label>
                    <Input {...register('provider')} placeholder='Enter provider'/>
                    {errors.provider && <ErrorText>{errors.provider.message}</ErrorText>}
                </div>
                <div>
                    <Label>Deadline</Label>
                    <Input
                        type='datetime-local'
                        defaultValue={dateToMinutePrecisionString(fromUTCToGMT7(new Date()))}
                        {...register('deadline', {setValueAs: (v) => new Date(v).toISOString()})}
                    />
                    {errors.deadline && <ErrorText>{errors.deadline.message}</ErrorText>}
                </div>
                <div>
                    <Label>Reference URL</Label>
                    <Input
                        type='url'
                        {...register('reference')}
                        placeholder='https://example.com'
                    />
                    {errors.reference && (
                        <ErrorText>{errors.reference.message}</ErrorText>
                    )}
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea
                        {...register('description')}
                        rows={5}
                        placeholder='Enter description'
                    />
                    {errors.description && (
                        <ErrorText>{errors.description.message}</ErrorText>
                    )}
                </div>

                <Button type='submit' className='bg-navy' disabled={creating}>
                    {creating ? 'Creating…' : 'Add Scholarship'}
                </Button>
            </form>
        </Wrapper>
    );
}
