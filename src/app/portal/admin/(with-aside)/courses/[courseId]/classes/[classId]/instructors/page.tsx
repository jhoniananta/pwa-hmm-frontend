import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import InstructorSection from './instructor-section';
import {PlusIcon} from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';
import {getInstructors} from "@/_actions/instructors-action";

export const dynamic = 'force-dynamic';

export default async function Instructors({params}: { params: { courseId: string, classId: string } }) {
    const instructors = await getInstructors(params.courseId, params.classId);

    return (
        <>
            <AdminHeader title='Lessons'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
                <CustomLink href={`/portal/admin/courses/${params.courseId}/classes/${params.classId}/instructors/add`}>
                    <div className='flex items-center'>
                        <PlusIcon className='w-4 h-4 mr-2'/>
                        Add Instructor
                    </div>
                </CustomLink>
            </div>
            <InstructorSection data={instructors} courseId={params.courseId} classId={params.classId}/>
        </>
    );
} 