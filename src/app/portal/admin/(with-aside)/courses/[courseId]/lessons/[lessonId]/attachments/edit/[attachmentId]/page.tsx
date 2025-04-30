import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditAttachmentForm from '../../_components/edit-attachment-form';
import Wrapper from '@/app/portal/admin/wrapper';
import {getAttachmentById} from "@/_actions/attachments-action";

export default async function EditAttachment({
                                                 params
                                             }: {
    params: { courseId: string; lessonId: string, attachmentId: string }
}) {
    const attachment = await getAttachmentById(params.courseId, params.lessonId, params.attachmentId);

    return (
        <>
            <AdminHeader title='Edit Attachment'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditAttachmentForm attachment={attachment} courseId={params.courseId} lessonId={params.lessonId}
                                    attachmentId={params.attachmentId}/>
            </Wrapper>
        </>
    );
} 