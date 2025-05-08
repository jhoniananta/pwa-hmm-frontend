'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import validationErrorToString from "@/lib/validationErrorToString";
import {AttachmentResponse, updateAttachment} from "@/_actions/attachments-action";

interface EditAttachmentFormProps {
    attachment: AttachmentResponse;
    courseId: string;
    lessonId: string;
    attachmentId: string;
}

export default function EditAttachmentForm({
                                               attachment,
                                               courseId,
                                               lessonId,
                                               attachmentId
                                           }: EditAttachmentFormProps) {
    const router = useRouter();
    const [name, setName] = useState(attachment.name);
    const [description, setDescription] = useState(attachment.description ?? '');

    const {execute: executeUpdate, status} = useAction(updateAttachment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Attachment updated successfully');
            router.push(`/portal/admin/courses/${courseId}/lessons/${lessonId}/attachments`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to update attachment');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        executeUpdate({
            courseId: Number(courseId),
            lessonId: Number(lessonId),
            attachmentId: Number(attachmentId),
            name,
            description,
        });
    };

    return (
        <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium'>
                    Name
                </label>
                <Input
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter attachment name'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='description' className='text-sm font-medium'>
                    Description
                </label>
                <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Enter attachment description'
                    rows={5}
                />
            </div>

            <Button
                type='submit'
                disabled={status === 'executing'}
                className={cn(
                    'bg-navy hover:bg-navy/80',
                    status === 'executing' && 'opacity-50 cursor-not-allowed'
                )}
            >
                Update
            </Button>
        </form>
    );
} 