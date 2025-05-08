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
import {deleteCourseSchedule} from "@/_actions/schedule-action";

interface ScheduleSectionProps {
    data: any[];
    courseId: string;
}

export default function ScheduleSection({data, courseId}: ScheduleSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const schedulesPerPage = 6;
    const totalPage = Math.ceil(data.length / schedulesPerPage);

    const {execute: executeDelete} = useAction(deleteCourseSchedule, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Schedule deleted successfully');
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to delete schedule');
        },
    });

    const handleDelete = (scheduleId: number) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            executeDelete({courseId: Number(courseId), scheduleId});
        }
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((schedule, index) => {
                        if (index < (page - 1) * schedulesPerPage || index >= page * schedulesPerPage) return null;

                        return (
                            <TableRow key={schedule.id}>
                                <TableCell>{schedule.title}</TableCell>
                                <TableCell>{schedule.description}</TableCell>
                                <TableCell>{schedule.location}</TableCell>
                                <TableCell>{new Date(schedule.startDate).toLocaleString()}</TableCell>
                                <TableCell>{new Date(schedule.endDate).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Ellipsis size={20}/>
                                        </PopoverTrigger>
                                        <PopoverContent align='end' className='w-40 border-navy border p-1'>
                                            <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                <h3 className='font-bold text-sm p-2'>Action</h3>
                                                <Link
                                                    href={`/portal/admin/courses/${courseId}/schedules/edit/${schedule.scheduleId}`}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(schedule.scheduleId)}
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