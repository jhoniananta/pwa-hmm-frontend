import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddAttachmentForm
    from "@/app/portal/admin/(with-aside)/courses/[courseId]/lessons/[lessonId]/attachments/_components/add-attachment-form";

export default function AddAttachment({params}: { params: { courseId: string, lessonId: string } }) {
    return (
        <>
            <AdminHeader title='Add Attachment'/>
            <AdminBreadcrumb/>
            <div className={'flex-2'}>
                <Wrapper>
                    <AddAttachmentForm courseId={params.courseId} lessonId={params.lessonId}/>
                </Wrapper>
            </div>
        </>
    );
}