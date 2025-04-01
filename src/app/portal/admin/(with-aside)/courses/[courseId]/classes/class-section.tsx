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
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteClass } from '@/_actions/class-action';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";

interface ClassSectionProps {
  data: any[];
  courseId: string;
}

export default function ClassSection({ data, courseId }: ClassSectionProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const classesPerPage = 6;
  const totalPage = Math.ceil(data.length / classesPerPage);

  const { execute: executeDelete } = useAction(deleteClass, {
    onSuccess: () => {
      toast.success('Class deleted successfully');
    },
    onError: (err) => {
      toast.error(err.error.serverError || 'Failed to delete class');
    },
  });

  const handleDelete = (classId: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      executeDelete({ courseId: Number(courseId), classId });
    }
  };

  return (
    <Wrapper>
      <Table className='table-admin'>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((classItem, index) => {
            if (index < (page - 1) * classesPerPage || index >= page * classesPerPage) return null;

            return (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.description}</TableCell>
                <TableCell>{classItem.day}</TableCell>
                <TableCell>{new Date(classItem.startTime).toLocaleTimeString()}</TableCell>
                <TableCell>{new Date(classItem.endTime).toLocaleTimeString()}</TableCell>
                <TableCell>{classItem.room}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <Ellipsis size={20}/>
                    </PopoverTrigger>
                    <PopoverContent align='end' className='w-40 border-navy border p-1'>
                      <div className='flex flex-col text-sm *:text-left *:font-medium'>
                        <h3 className='font-bold text-sm p-2'>Action</h3>
                        <Link
                          href={`/portal/admin/courses/${courseId}/classes/edit/${classItem.id}`}
                          className='hover:bg-navy/40 p-2 rounded-md transition'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(classItem.id)}
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