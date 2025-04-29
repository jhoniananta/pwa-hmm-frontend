import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import ClassAssignmentSection from './class-assignment-section';
import {PlusIcon} from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';
import {getClassAssignments} from "@/_actions/class-assignment-action";

export const dynamic = 'force-dynamic';

export default async function ClassAssignments({params}: { params: { courseId: string, classId: string } }) {
    const assignments = await getClassAssignments(params.courseId, params.classId);

    return (
        <>
            <AdminHeader title='Lessons'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
                <CustomLink href={`/portal/admin/courses/${params.courseId}/classes/${params.classId}/assignments/add`}>
                    <div className='flex items-center'>
                        <PlusIcon className='w-4 h-4 mr-2'/>
                        Add Assignment
                    </div>
                </CustomLink>
            </div>
            <ClassAssignmentSection data={assignments} courseId={params.courseId} classId={params.classId}/>
        </>
    );
} 