'use client';

import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Ellipsis} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useAction} from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";
import {ClassAssignmentResponse, deleteClassAssignment} from "@/_actions/class-assignment-action";
import validationErrorToString from "@/lib/validationErrorToString";

interface ClassAssignmentSectionProps {
    data: ClassAssignmentResponse[];
    courseId: string;
    classId: string
}

export default function ClassAssignmentSection({data, courseId, classId}: ClassAssignmentSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const assignmentsPerPage = 6;
    const totalPage = Math.ceil(data.length / assignmentsPerPage);

    const {execute: executeDelete} = useAction(deleteClassAssignment, {
        onSuccess: () => {
            toast.success('Assignment deleted successfully');
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to delete assignment');
        },
    });

    const handleDelete = (assignmentId: number) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            executeDelete({courseId: Number(courseId), classId: Number(classId), assignmentId});
        }
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Submission</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Task Type</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((assignment, index) => {
                        if (index < (page - 1) * assignmentsPerPage || index >= page * assignmentsPerPage) return null;

                        return (
                            <TableRow key={assignment.assignmentId}>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{assignment.submission}</TableCell>
                                <TableCell>{assignment.deadline.toISOString()}</TableCell>
                                <TableCell>{assignment.description}</TableCell>
                                <TableCell>{assignment.taskType}</TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(assignment.createdAt).toDateString()}
                                </TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(assignment.updatedAt).toDateString()}
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
                                                    href={`/portal/admin/courses/${courseId}/classses/${classId}/assignments/edit/${assignment.assignmentId}`}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(assignment.assignmentId)}
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