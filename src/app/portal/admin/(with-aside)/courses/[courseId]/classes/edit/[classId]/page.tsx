import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditClassForm from '../../_components/edit-class-form';
import { getClassById } from '@/_actions/class-action';
import Wrapper from '@/app/portal/admin/wrapper';

export default async function EditClass({ 
  params 
}: { 
  params: { courseId: string; classId: string } 
}) {
  const classData = await getClassById(Number(params.courseId), Number(params.classId));

  return (
    <>
      <AdminHeader title='Edit Class' />
      <AdminBreadcrumb />
      <Wrapper>
        <EditClassForm classData={classData} courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 