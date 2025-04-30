import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddVideoForm from '../_components/add-video-form';

export default function AddClassAssignment({params}: { params: { courseId: string, lessonId: string } }) {
    return (
        <>
            <AdminHeader title='Add Class Assignment'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <AddVideoForm courseId={params.courseId} lessonId={params.lessonId}/>
            </Wrapper>
        </>
    );
}