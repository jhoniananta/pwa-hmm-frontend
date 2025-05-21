'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover';
import {Ellipsis} from 'lucide-react';
import Pagination from '@/components/client/pagination';
import Wrapper from '@/app/portal/admin/wrapper';
import Link from 'next/link';
import {UserManagedClassResponse} from "@/_actions/courses-action";

function AssignmentTable({
                             data,
                         }: {
    data: (UserManagedClassResponse)[];
}) {
    const [page, setPage] = useState(1);
    const assignmentPerPage = 6;
    const totalPage = Math.ceil(data.length / assignmentPerPage);

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(
                        (
                            {
                                courseId,
                                classId,
                                courseTitle,
                                className,
                            },
                            index
                        ) => {
                            if (
                                index < (page - 1) * assignmentPerPage ||
                                index >= page * assignmentPerPage
                            )
                                return null;

                            return (
                                <TableRow key={`${courseId}-${classId}`} className='even:bg-navy/5 odd:bg-transparent'>
                                    <TableCell>{courseTitle}</TableCell>
                                    <TableCell>{className}</TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Ellipsis size={20}/>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align='end'
                                                className='w-40 border-navy border p-1'
                                            >
                                                <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                    <h3 className='font-bold text-sm p-2'>Action</h3>
                                                    <Link
                                                        href={`/portal/admin/courses//${courseId}/classes/${classId}/assignments`}
                                                        className='hover:bg-navy/40 p-2 rounded-md transition'
                                                    >
                                                        Manage
                                                    </Link>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
            <Pagination
                page={page}
                setPage={setPage}
                totalPage={totalPage}
            />
        </Wrapper>
    );
}

export default AssignmentTable;
