import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import { getLessons } from '@/_actions/lessons-action';
import LessonSection from './lesson-section';
import { PlusIcon } from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';

export const dynamic = 'force-dynamic';

export default async function Lessons({ params }: { params: { courseId: string } }) {
  const lessons = await getLessons(params.courseId);
  
  return (
    <>
      <AdminHeader title='Lessons' />
      <div className='flex justify-between items-center'>
        <AdminBreadcrumb />
        <CustomLink href={`/portal/admin/courses/${params.courseId}/lessons/add`}>
          <div className='flex items-center'>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Lesson
          </div>
        </CustomLink>
      </div>
      <LessonSection data={lessons} courseId={params.courseId} />
    </>
  );
} 