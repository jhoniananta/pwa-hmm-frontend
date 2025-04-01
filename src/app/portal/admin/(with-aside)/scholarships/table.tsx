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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import Pagination from '@/components/client/pagination';
import { $ScholarshipAPI } from 'lms-types';
import Wrapper from '@/app/portal/admin/wrapper';
import { useAction } from 'next-safe-action/hooks';
import { deleteScholarship } from '@/_actions/scholarship-action';
import { toast } from 'sonner';
import Link from 'next/link';

function ScholarshipTable({
  data,
}: {
  data: $ScholarshipAPI.GetScholarships.Response['data'];
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPage = Math.ceil(data.length / itemsPerPage);

  const { execute: executeDelete } = useAction(deleteScholarship, {
    onSuccess: () => {
      toast.success('Scholarship deleted successfully');
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to delete scholarship');
    },
  });

  return (
    <Wrapper>
      <Table className='table-admin'>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Funding</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((scholarship, index) => {
            if (
              index < (page - 1) * itemsPerPage ||
              index >= page * itemsPerPage
            )
              return null;

            return (
              <TableRow key={scholarship.id} className='even:bg-navy/5 odd:bg-transparent'>
                <TableCell>{scholarship.title}</TableCell>
                <TableCell>{scholarship.provider}</TableCell>
                <TableCell>
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </TableCell>
                <TableCell>{scholarship.funding}</TableCell>
                <TableCell>{scholarship.scope}</TableCell>
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
                          href={`/portal/admin/scholarships/edit/${scholarship.id}`}
                          className='hover:bg-navy/40 p-2 rounded-md transition'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            executeDelete({ scholarshipId: scholarship.id })
                          }
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
      <Pagination page={page} setPage={setPage} totalPage={totalPage} />
    </Wrapper>
  );
}

export default ScholarshipTable; 