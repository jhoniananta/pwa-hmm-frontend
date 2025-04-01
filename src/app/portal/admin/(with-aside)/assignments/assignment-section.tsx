'use client';

import CustomLink from '@/components/admin/custom-link';
import AssignmentTable from './table';
import Search from '@/components/client/search';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { $CourseClassAssignmentAPI, CourseClassModel } from 'lms-types';

type AssignmentData = ($CourseClassAssignmentAPI.GetAssignments.Response['data'][number] & {
  class: CourseClassModel;
} & {
  course: string;
  courseId: number;
  classId: number;
})[];

export default function AssignmentSection({ 
  data 
}: { 
  data: AssignmentData
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  const filteredData = data.filter((assignment) =>
    assignment.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    assignment.course.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    assignment.submission.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    assignment.taskType.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-between gap-4 md:items-center mb-4">
        <Search
          query={searchQuery}
          setQuery={setSearchQuery}
          className="w-full md:w-[300px]"
        />
        <CustomLink href={'assignments/add'} className='self-end md:self-auto'>Add Assignment</CustomLink>
      </div>
      {filteredData.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8">
          No assignments found
        </div>
      ) : (
        <AssignmentTable data={filteredData} />
      )}
    </>
  );
} 