import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditAssignmentForm from '../../_components/edit-assignment-form';
import Wrapper from '@/app/portal/admin/wrapper';
import {getClassAssignmentById} from "@/_actions/class-assignment-action";

export default async function EditClassAssignment({
                                                      params
                                                  }: {
    params: { courseId: string; classId: string, assignmentId: string }
}) {
    const assignment = await getClassAssignmentById(params.courseId, params.classId, params.assignmentId);

    return (
        <>
            <AdminHeader title='Edit Assignment'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditAssignmentForm assignment={assignment as any} courseId={params.courseId} classId={params.classId}
                                    assignmentId={params.assignmentId}/>
            </Wrapper>
        </>
    );
} 