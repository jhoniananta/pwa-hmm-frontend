'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Ellipsis} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useAction} from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";
import validationErrorToString from "@/lib/validationErrorToString";
import {deleteInstructor, InstructorResponse} from "@/_actions/instructors-action";

interface InstructorSectionProps {
    data: InstructorResponse[];
    courseId: string;
    classId: string
}

export default function InstructorSection({data, courseId, classId}: InstructorSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const instructorsPerPage = 6;
    const totalPage = Math.ceil(data.length / instructorsPerPage);

    const {execute: executeDelete} = useAction(deleteInstructor, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Instructor deleted successfully');
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to delete instructor');
        },
    });

    const handleDelete = (userId: number) => {
        if (window.confirm('Are you sure you want to delete this instructor?')) {
            executeDelete({courseId: Number(courseId), classId: Number(classId), userId});
        }
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((instructor, index) => {
                        if (index < (page - 1) * instructorsPerPage || index >= page * instructorsPerPage) return null;
                        return (
                            <TableRow key={instructor.userId}>
                                <TableCell>{instructor.name}</TableCell>
                                <TableCell>{instructor.NIM}</TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(instructor.createdAt).toLocaleString()}
                                </TableCell>

                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Ellipsis size={20}/>
                                        </PopoverTrigger>
                                        <PopoverContent align='end' className='w-40 border-navy border p-1'>
                                            <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                <h3 className='font-bold text-sm p-2'>Action</h3>
                                                <button
                                                    onClick={() => handleDelete(instructor.userId)}
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