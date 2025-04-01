'use client';

import React, { useState } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import Pagination from '@/components/client/pagination';
import { $CourseClassAssignmentAPI, CourseClassModel } from 'lms-types';
import Wrapper from '@/app/portal/admin/wrapper';
import { useAction } from 'next-safe-action/hooks';
import { deleteAssignment } from '@/_actions/assignment-action';
import { toast } from 'sonner';
import Link from 'next/link';

function AssignmentTable({
  data,
}: {
  data: ($CourseClassAssignmentAPI.GetAssignments.Response['data'][number] & {
    class: CourseClassModel;
  } & {
    course: string;
    courseId: number;
    classId: number;
  })[];
}) {
  const [page, setPage] = useState(1);
  const assignmentPerPage = 6;
  const totalPage = Math.ceil(data.length / assignmentPerPage);
  const { execute: exeDA } = useAction(deleteAssignment, {
    onSuccess: () => {
      toast.success('Assignment deleted');
    },
    onError: ({ error: { serverError, validationErrors, fetchError } }) => {
      toast.error(
        serverError ||
        fetchError ||
        validationErrors?.toString() ||
        'Failed to delete assignment'
      );
    },
  });

  return (
    <Wrapper>
      <Table className='table-admin'>
        <TableHeader>
          <TableRow >
            <TableHead>Course</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Submission</TableHead>
            <TableHead>Task Type</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(
            (
              {
                id,
                title,
                deadline,
                course,
                submission,
                taskType,
                classId,
                courseId,
              },
              index
            ) => {
              if (
                index < (page - 1) * assignmentPerPage ||
                index >= page * assignmentPerPage
              )
                return null;

              return (
                <TableRow key={id + title} className='even:bg-navy/5 odd:bg-transparent'>
                  <TableCell>{course}</TableCell>
                  <TableCell>{title}</TableCell>
                  <TableCell className='whitespace-nowrap text-nowrap'>
                    {new Date(deadline).toDateString()}
                  </TableCell>
                  <TableCell className='capitalize'>{submission}</TableCell>
                  <TableCell>{taskType}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <Ellipsis size={20} />
                      </PopoverTrigger>
                      <PopoverContent
                        align='end'
                        className='w-40 border-navy border p-1'
                      >
                        <div className='flex flex-col text-sm *:text-left *:font-medium'>
                          <h3 className='font-bold text-sm p-2'>Action</h3>
                          <Link
                            href={`assignments/edit/${courseId}/${classId}/${id}?title=${encodeURIComponent(title)}&deadline=${encodeURIComponent(new Date(deadline).toDateString())}&submission=${encodeURIComponent(submission)}&taskType=${encodeURIComponent(taskType)}&description=${encodeURIComponent(course)}`}
                            className='hover:bg-navy/40 p-2 rounded-md transition'
                          >
                            Edit
                          </Link>
                          <button
                            className='hover:bg-navy/40 p-2 rounded-md transition'
                            onClick={() =>
                              exeDA({
                                courseId: Number(courseId),
                                classId: Number(classId),
                                assignmentId: Number(id),
                              })
                            }
                          >
                            Delete
                          </button>
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
