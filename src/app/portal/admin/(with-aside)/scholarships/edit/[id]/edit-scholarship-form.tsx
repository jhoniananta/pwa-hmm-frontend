'use client'; // This component handles client-side logic

import {zodResolver} from '@hookform/resolvers/zod';
import {useAction} from 'next-safe-action/hooks';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';

import {updateScholarship} from '@/_actions/scholarship-action';
import {addTagscholarship, deleteTagscholarship, TagResponse,} from '@/_actions/tag-action'; // Import TagResponse type
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {updateScholarshipSchema} from '@/lib/schema';
import Wrapper from '../../../../wrapper';
import {MinusSquare, PlusSquare} from 'lucide-react';
import {extractMessage} from '@/lib/utils';

// Define props including the fetched tags and initial values
type EditScholarshipFormProps = {
    tags: TagResponse[];
    defaultValues: z.infer<typeof updateScholarshipSchema>;
};

export default function EditScholarshipForm({
                                                tags,
                                                defaultValues,
                                            }: EditScholarshipFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof updateScholarshipSchema>>({
        resolver: zodResolver(updateScholarshipSchema),
        defaultValues,
    });

    const {execute: executeUpdateScholarship, isExecuting} = useAction(
        updateScholarship,
        {
            onSuccess: (response: any) => {
                if (response?.data?.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Scholarship updated successfully');
                router.push('/portal/admin/scholarships');
            },
            onError: ({error}) => {
                toast.error(extractMessage(error.serverError || error.fetchError));
            },
        }
    );

    // Add useAction for adding tags
    const {execute: executeAddTag, isExecuting: isAddingTag} = useAction(
        addTagscholarship,
        {
            onSuccess: (response: any) => {
                if (response?.data?.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Tag added successfully!');
            },
            onError: ({error}) => {
                toast.error(
                    String(error.serverError || error.fetchError || 'Failed to add tag.')
                );
            },
        }
    );

    // Delete tag action
    const {execute: executeDeleteTag, isExecuting: isDeletingTag} = useAction(
        deleteTagscholarship,
        {
            onSuccess: (response: any) => {
                if (response?.data?.error) {
                    toast.error(response?.data?.error);
                    return;
                }
                toast.success('Tag deleted successfully!');
            },
            onError: ({error}) => {
                toast.error(
                    String(
                        error.serverError || error.fetchError || 'Failed to delete tag.'
                    )
                );
            },
        }
    );

    const onSubmit = handleSubmit((data) => {
        console.log('Form data:', data);
        executeUpdateScholarship(data);
    });

    const handleAddTag = (tagId: number) => {
        executeAddTag({
            scholarshipId: defaultValues.scholarshipId,
            tagId, // Send the single tag ID in an array as per schema
        });
    };

    const handleRemoveTag = (tagId: number) => {
        executeDeleteTag({
            scholarshipId: defaultValues.scholarshipId,
            tagId,
        });
    };

    return (
        <Wrapper>
            <form onSubmit={onSubmit} className='space-y-4'>
                {/* Title */}
                <div>
                    <Label>Title</Label>
                    <Input {...register('title')} />
                    {errors.title && (
                        <span className='text-red-500 text-sm'>{errors.title.message}</span>
                    )}
                </div>

                {/* Provider */}
                <div>
                    <Label>Provider</Label>
                    <Input {...register('provider')} />
                    {errors.provider && (
                        <span className='text-red-500 text-sm'>
              {errors.provider.message}
            </span>
                    )}
                </div>

                {/* Deadline */}
                <div>
                    <Label>Deadline</Label>
                    <Input
                        type='datetime-local'
                        {...register('deadline', {
                            setValueAs: (value) => (value ? new Date(value).toISOString() : undefined), // Handle empty value
                        })}
                    />
                    {errors.deadline && (
                        <span className='text-red-500 text-sm'>
              {errors.deadline.message}
            </span>
                    )}
                </div>

                {/* Reference URL */}
                <div>
                    <Label>Reference URL</Label>
                    <Input type='url' {...register('reference')} />
                    {errors.reference && (
                        <span className='text-red-500 text-sm'>
              {errors.reference.message}
            </span>
                    )}
                </div>

                {/* Tags Select */}
                <div>
                    <Label>Available Tags</Label>
                    <div className='mt-2 space-y-2 rounded-md border p-4'>
                        {tags.length ? (
                            tags.map((tag: TagResponse) => {
                                const selected =
                                    Array.isArray(defaultValues.tags) &&
                                    defaultValues.tags.includes(tag.tagId);

                                return (
                                    <div
                                        key={tag.tagId}
                                        className='flex items-center justify-between'
                                    >
                                        <span>{tag.title}</span>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() =>
                                                selected
                                                    ? handleRemoveTag(tag.tagId)
                                                    : handleAddTag(tag.tagId)
                                            }
                                            disabled={isAddingTag || isDeletingTag}
                                            aria-label={
                                                selected
                                                    ? `Remove tag ${tag.title}`
                                                    : `Add tag ${tag.title}`
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
                                No tags available.
                            </p>
                        )}
                    </div>
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

                <Button type='submit' className='bg-navy' disabled={isExecuting}>
                    {isExecuting ? 'Updating...' : 'Update Scholarship'}
                </Button>
            </form>
        </Wrapper>
    );
}