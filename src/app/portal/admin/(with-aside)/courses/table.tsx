'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Ellipsis} from "lucide-react";
import Pagination from "@/components/client/pagination";
import {$CourseAPI} from "lms-types";
import Wrapper from "@/app/portal/admin/wrapper";
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import Link from 'next/link';
import {deleteCourse} from '@/_actions/courses-action';

function CoursesTable({data}: { data: $CourseAPI.GetCourses.Response["data"] }) {
    const [page, setPage] = useState(1);
    const coursesPerPage = 6;
    const totalPage = Math.ceil(data.length / coursesPerPage);

    const {execute: executeDelete} = useAction(deleteCourse, {
        onSuccess: () => {
            toast.success('Course deleted successfully');
        },
        onError: (err) => {
            toast.error(err.error.serverError || 'Failed to delete course');
        },
    });

    const handleDelete = (courseId: number) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            executeDelete({courseId});
        }
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Instructors</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Assignments</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead>Videos</TableHead>
                        <TableHead>Durations</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((course, index) => {
                        const description = course.description ?? ''
                        const updatedAt = course.updatedAt ? new Date(course.updatedAt).toDateString() : '-';

                        if (index < (page - 1) * coursesPerPage || index >= page * coursesPerPage) return null;

                        return (
                            <TableRow key={course.courseId} className='even:bg-navy/5 odd:bg-transparent'>
                                <TableCell>{course.title}</TableCell>
                                <TableCell
                                    className='whitespace-nowrap text-nowrap'>{description.length > 100 ? description.slice(0, 100) + "..." : description}</TableCell>
                                <TableCell>{course.numberOfStudents}</TableCell>
                                <TableCell>{course.numberOfInstructors}</TableCell>
                                <TableCell>{course.numberOfClasses}</TableCell>
                                <TableCell>{course.numberOfAssignments}</TableCell>
                                <TableCell>{course.numberOfLessons}</TableCell>
                                <TableCell>{course.numberOfVideos}</TableCell>
                                <TableCell>{course.numberOfDurations}</TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(course.createdAt).toDateString()}
                                </TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {updatedAt}
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
                                                    href={`/portal/admin/courses/edit/${course.courseId}`}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(course.courseId)}
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

export default CoursesTable;