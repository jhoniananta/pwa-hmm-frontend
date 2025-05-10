import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddVideoForm from '../_components/add-video-form';

export default function AddVideo({params}: { params: { courseId: string, lessonId: string } }) {

    return (
        <>
            <AdminHeader title='Add Video'/>
            <AdminBreadcrumb/>
            <div className={'flex-2'}>
                <Wrapper>
                    <AddVideoForm courseId={params.courseId} lessonId={params.lessonId}/>
                </Wrapper>
            </div>
        </>
    );
}