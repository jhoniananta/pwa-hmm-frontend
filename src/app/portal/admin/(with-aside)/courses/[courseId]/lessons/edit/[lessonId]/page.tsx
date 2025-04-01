import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditLessonForm from '../../_components/edit-lesson-form';
import { getLessonById } from '@/_actions/lessons-action';
import Wrapper from '@/app/portal/admin/wrapper';

export default async function EditLesson({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  const lesson = await getLessonById(params.courseId, params.lessonId);

  return (
    <>
      <AdminHeader title='Edit Lesson' />
      <AdminBreadcrumb />
      <Wrapper>
        <EditLessonForm lesson={lesson} courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 