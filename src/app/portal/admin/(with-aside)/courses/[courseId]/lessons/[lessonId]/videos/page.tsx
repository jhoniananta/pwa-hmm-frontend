import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import VideoSection from './video-section';
import {PlusIcon} from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';
import {getVideos} from "@/_actions/videos-action";

export const dynamic = 'force-dynamic';

export default async function Videos({params}: { params: { courseId: string, lessonId: string } }) {
    const videos = await getVideos(params.courseId, params.lessonId);

    return (
        <>
            <AdminHeader title='Lessons'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
                <CustomLink
                    href={`/portal/admin/courses/${params.courseId}/lessons/${params.lessonId}/videos/add`}>
                    <div className='flex items-center'>
                        <PlusIcon className='w-4 h-4 mr-2'/>
                        Add Video
                    </div>
                </CustomLink>
            </div>
            <VideoSection data={videos} courseId={params.courseId} lessonId={params.lessonId}/>
        </>
    );
} 