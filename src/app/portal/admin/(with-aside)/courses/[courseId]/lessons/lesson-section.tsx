'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CourseLessonModel } from 'lms-types';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteLesson } from '@/_actions/lessons-action';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";

interface LessonSectionProps {
  data: CourseLessonModel[];
  courseId: string;
}

export default function LessonSection({ data, courseId }: LessonSectionProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const lessonsPerPage = 6;
  const totalPage = Math.ceil(data.length / lessonsPerPage);

  const { execute: executeDelete } = useAction(deleteLesson, {
    onSuccess: () => {
      toast.success('Lesson deleted successfully');
    },
    onError: (err) => {
      toast.error(err.error.serverError || 'Failed to delete lesson');
    },
  });

  const handleDelete = (lessonId: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      executeDelete({ courseId: Number(courseId), lessonId });
    }
  };

  return (
    <Wrapper>
      <Table className='table-admin'>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Total Videos</TableHead>
            <TableHead>Total Duration</TableHead>
            <TableHead>Total Attachments</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((lesson, index) => {
            if (index < (page - 1) * lessonsPerPage || index >= page * lessonsPerPage) return null;

            return (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>{lesson.totalVideos}</TableCell>
                <TableCell>{lesson.totalDurations}</TableCell>
                <TableCell>{lesson.totalAttachments}</TableCell>
                <TableCell className='whitespace-nowrap text-nowrap'>
                  {new Date(lesson.createdAt).toDateString()}
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
                          href={`/portal/admin/courses/${courseId}/lessons/edit/${lesson.id}`}
                          className='hover:bg-navy/40 p-2 rounded-md transition'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(lesson.id)}
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