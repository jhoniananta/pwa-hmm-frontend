import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddLessonForm from '../_components/add-lesson-form';

export default function AddLesson({ params }: { params: { courseId: string } }) {
  return (
    <>
      <AdminHeader title='Add Lesson' />
      <AdminBreadcrumb />
      <Wrapper>
        <AddLessonForm courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 