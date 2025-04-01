import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import { getSchedules } from '@/_actions/schedule-action';
import ScheduleSection from './schedule-section';
import { PlusIcon } from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';

export const dynamic = 'force-dynamic';

export default async function Schedules({ params }: { params: { courseId: string } }) {
  const schedules = await getSchedules(Number(params.courseId));
  
  return (
    <>
      <AdminHeader title='Schedules' />
      <div className='flex justify-between items-center'>
        <AdminBreadcrumb />
        <CustomLink href={`/portal/admin/courses/${params.courseId}/schedules/add`}>
          <div className='flex items-center'>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Schedule
          </div>
        </CustomLink>
      </div>
      <ScheduleSection data={schedules} courseId={params.courseId} />
    </>
  );
} 