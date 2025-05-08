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
import {MinusSquare, PlusSquare} from 'lucide-react';

type AddFormProps = {
    tags: TagResponse[];
};

export default function AddForm({tags}: AddFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm<z.infer<typeof addScholarshipSchema>>({
        resolver: zodResolver(addScholarshipSchema),
        defaultValues: {
            title: '',
            provider: '',
            deadline: new Date(),
            reference: '',
            // funding: undefined,
            // scope: '',
            description: '',
            tags: [],
        },
    });
    console.log('Selected Tags:', watch('tags'));
    // create scholarship
    const {execute: execCreate, isExecuting: creating} = useAction(
        createScholarship,
        {
            onSuccess: (response: any) => {
                if (response?.data?.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Scholarship created');
                router.push('/portal/admin/scholarships');
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

    const selectedTags: TagResponse[] = (watch('tags') || []).map(
        (tagId) => tags.find((tag) => tag.tagId === tagId) as TagResponse
    );

    // add tag
    const addTag = (tag: TagResponse) => {
        const isAlreadySelected = selectedTags.some(
            (selectedTag) => selectedTag.tagId === tag.tagId
        );
        if (!isAlreadySelected) {
            const updatedTags = [...selectedTags, tag];
            setValue(
                'tags',
                updatedTags.map((tag) => tag.tagId)
            );
            toast.success(`Tag "${tag.title}" added`);
        }
    };

    // delete tag
    const removeTag = (tag: TagResponse) => {
        const updatedTags = selectedTags.filter(
            (selectedTag) => selectedTag.tagId !== tag.tagId
        );
        setValue(
            'tags',
            updatedTags.map((tag) => tag.tagId)
        );
        toast.success(`Tag "${tag.title}" removed`);
    };

    const onSubmit = handleSubmit((data) => {
        // Include the selected tags in the payload
        const payload = {
            ...data,
            tags: selectedTags.map((tag) => ({
                tagId: tag.tagId,
                title: tag.title,
            })),
        };

        console.log('Payload being sent:', payload);
        execCreate(payload);
    });

    return (
        <Wrapper>
            <form onSubmit={onSubmit} className='space-y-4'>
                {/* same fields as edit */}
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
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        {...register('deadline', {setValueAs: (v) => new Date(v)})}
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

                {/* tags picker */}
                <div>
                    <Label>Available Tags</Label>
                    <div className='mt-2 space-y-2 border p-4 rounded-md'>
                        {tags.length > 0 ? (
                            tags.map((tag: TagResponse, index) => {
                                const isSelected = selectedTags.some(
                                    (selectedTag) => selectedTag.tagId === tag.tagId
                                );
                                return (
                                    <div
                                        key={`${tag.tagId}-${index}`} // Ensure uniqueness by appending the index
                                        className='flex justify-between items-center'
                                    >
                                        <span>{tag.title}</span>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                                isSelected ? removeTag(tag) : addTag(tag);
                                            }}
                                            aria-label={
                                                isSelected ? `Remove ${tag.title}` : `Add ${tag.title}`
                                            }
                                        >
                                            {isSelected ? (
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
                                No tags available.
                            </p>
                        )}
                    </div>
                </div>

                <Button type='submit' className='bg-navy' disabled={creating}>
                    {creating ? 'Creating…' : 'Add Scholarship'}
                </Button>
            </form>
        </Wrapper>
    );
}
