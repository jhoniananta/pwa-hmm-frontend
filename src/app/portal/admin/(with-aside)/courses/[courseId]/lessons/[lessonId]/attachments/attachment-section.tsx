'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Ellipsis} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useAction} from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";
import validationErrorToString from "@/lib/validationErrorToString";
import {AttachmentResponse, deleteAttachment} from "@/_actions/attachments-action";

interface AttachmentSectionProps {
    data: AttachmentResponse[];
    courseId: string;
    lessonId: string
}

export default function AttachmentSection({data, courseId, lessonId}: AttachmentSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const attachmentsPerPage = 6;
    const totalPage = Math.ceil(data.length / attachmentsPerPage);

    const {execute: executeDelete} = useAction(deleteAttachment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Attachment deleted successfully');
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to delete attachment');
        },
    });

    const handleDelete = (attachmentId: number) => {
        if (window.confirm('Are you sure you want to delete this attachment?')) {
            executeDelete({courseId: Number(courseId), lessonId: Number(lessonId), attachmentId});
        }
    }

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((attachment, index) => {
                        if (index < (page - 1) * attachmentsPerPage || index >= page * attachmentsPerPage) return null;
                        const updatedAtLocaleString = attachment.updatedAt ? new Date(attachment.updatedAt).toLocaleString() : ''

                        return (
                            <TableRow key={attachment.attachmentId}>
                                <TableCell>{attachment.name}</TableCell>
                                <TableCell>{attachment.description}</TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(attachment.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {updatedAtLocaleString}
                                </TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Ellipsis size={20}/>
                                        </PopoverTrigger>
                                        <PopoverContent align='end' className='w-40 border-navy border p-1'>
                                            <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                <h3 className='font-bold text-sm p-2'>Action</h3>
                                                <Link
                                                    href={`/portal/admin/courses/${courseId}/lessons/${lessonId}/attachments/edit/${attachment.attachmentId}`}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(attachment.attachmentId)}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition text-left'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination page={page} setPage={setPage} totalPage={totalPage}/>
        </Wrapper>
    );
}
