import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditVideoForm from '../../_components/edit-video-form';
import Wrapper from '@/app/portal/admin/wrapper';
import {getVideoById} from "@/_actions/videos-action";

export default async function EditVideo({
                                            params
                                        }: {
    params: { courseId: string; lessonId: string, videoId: string }
}) {
    const video = await getVideoById(params.courseId, params.lessonId, params.videoId);

    return (
        <>
            <AdminHeader title='Edit Video'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditVideoForm video={video} courseId={params.courseId} lessonId={params.lessonId}
                               videoId={params.videoId}/>
            </Wrapper>
        </>
    );
} 