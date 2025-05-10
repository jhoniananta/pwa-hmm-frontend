'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import React from 'react';
import {cn} from '@/lib/utils';
import validationErrorToString from '@/lib/validationErrorToString';
import {createAttachment} from '@/_actions/attachments-action';
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import UploadFile from '@/components/UploadFile';
import {FormProvider, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {addAttachmentSchema} from '@/_actions/schema/attachment-schema';

interface AddAttachmentFormProps {
    courseId: string;
    lessonId: string;
}

export default function AddAttachmentForm({
                                              courseId,
                                              lessonId,
                                          }: AddAttachmentFormProps) {
    const router = useRouter();

    const methods = useForm<z.infer<typeof addAttachmentSchema>>({
        defaultValues: {
            name: '',
            description: '',
            file: '',
            pdfFile: undefined,
            courseId: Number(courseId),
            lessonId: Number(lessonId),
        },
        resolver: zodResolver(addAttachmentSchema),
    });

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = methods;

    const {execute: executeCreate, status} = useAction(createAttachment, {
        onSuccess: (response) => {
            if (response?.data?.error) {
                toast.error(response.data.error);
                return;
            }
            toast.success('Attachment created successfully');
            reset(); // Reset the form after success
            router.push(
                `/portal/admin/courses/${courseId}/lessons/${lessonId}/attachments`
            );
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(
                fetchError ||
                validationErrorToString(validationErrors) ||
                'Failed to create attachment'
            );
        },
    });

    const onSubmit = (data: z.infer<typeof addAttachmentSchema>) => {
        const formData = new FormData();
        if (data.pdfFile instanceof File) {
            formData.append('pdfFile', data.pdfFile);
        } else {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        const fileUrl = `courses/${courseId}/lessons/${lessonId}/attachments/${Date.now()}-${data.pdfFile.name}`;
        executeCreate({
            courseId: Number(courseId),
            lessonId: Number(lessonId),
            name: data.name,
            description: data.description,
            file: fileUrl,
            pdfFile: formData,
        })
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                    control={control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter attachment name"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Enter attachment description" rows={5}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* PDF File Upload */}
                <FormField
                    control={control}
                    name="pdfFile"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>PDF File *</FormLabel>
                            <FormControl>
                                <UploadFile
                                    sessionIdName="pdfFile"
                                    accept={{'application/pdf': ['.pdf']}}
                                    maxSizeInBytes={5_000_000}
                                    onChange={(file: File) => field.onChange(file)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={status === 'executing'}
                    className={cn('bg-navy hover:bg-navy/80', status === 'executing' && 'opacity-50 cursor-not-allowed')}
                >
                    Create
                </Button>
            </form>
        </FormProvider>
    );
}