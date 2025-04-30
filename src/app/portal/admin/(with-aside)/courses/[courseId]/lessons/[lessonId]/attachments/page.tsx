import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AttachmentSection from './attachment-section';
import {PlusIcon} from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';
import {getAttachments} from "@/_actions/attachments-action";

export const dynamic = 'force-dynamic';

export default async function Attachments({params}: { params: { courseId: string, lessonId: string } }) {
    const attachments = await getAttachments(params.courseId, params.lessonId);

    return (
        <>
            <AdminHeader title='Lessons'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
                <CustomLink
                    href={`/portal/admin/courses/${params.courseId}/lessons/${params.lessonId}/attachments/add`}>
                    <div className='flex items-center'>
                        <PlusIcon className='w-4 h-4 mr-2'/>
                        Add Attachment
                    </div>
                </CustomLink>
            </div>
            <AttachmentSection data={attachments} courseId={params.courseId} lessonId={params.lessonId}/>
        </>
    );
} 