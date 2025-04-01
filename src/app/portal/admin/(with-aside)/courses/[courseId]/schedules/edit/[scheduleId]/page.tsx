import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditScheduleForm from '../../_components/edit-schedule-form';
import { getScheduleById } from '@/_actions/schedule-action';
import Wrapper from '@/app/portal/admin/wrapper';

export default async function EditSchedule({ 
  params 
}: { 
  params: { courseId: string; scheduleId: string } 
}) {
  const schedule = await getScheduleById(Number(params.courseId), Number(params.scheduleId));

  return (
    <>
      <AdminHeader title='Edit Schedule' />
      <AdminBreadcrumb />
      <Wrapper>
        <EditScheduleForm schedule={schedule} courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 