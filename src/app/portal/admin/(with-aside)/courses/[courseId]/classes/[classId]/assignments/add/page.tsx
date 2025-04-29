import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddAssignmentForm from '../_components/add-assignment-form';

export default function AddClassAssignment({params}: { params: { courseId: string, classId: string } }) {
    return (
        <>
            <AdminHeader title='Add Class Assignment'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <AddAssignmentForm courseId={params.courseId} classId={params.classId}/>
            </Wrapper>
        </>
    );
} 