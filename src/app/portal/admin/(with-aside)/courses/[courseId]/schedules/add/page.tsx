import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddScheduleForm from '../_components/add-schedule-form';

export default function AddSchedule({ params }: { params: { courseId: string } }) {
  return (
    <>
      <AdminHeader title='Add Schedule' />
      <AdminBreadcrumb />
      <Wrapper>
        <AddScheduleForm courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 