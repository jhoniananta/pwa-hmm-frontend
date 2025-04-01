import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddClassForm from '../_components/add-class-form';

export default function AddClass({ params }: { params: { courseId: string } }) {
  return (
    <>
      <AdminHeader title='Add Class' />
      <AdminBreadcrumb />
      <Wrapper>
        <AddClassForm courseId={params.courseId} />
      </Wrapper>
    </>
  );
} 