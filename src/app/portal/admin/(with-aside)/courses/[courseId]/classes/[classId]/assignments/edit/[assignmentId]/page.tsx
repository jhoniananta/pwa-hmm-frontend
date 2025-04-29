import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditLessonForm from '../../_components/edit-lesson-form';
import {getLessonById, LessonResponse} from '@/_actions/lessons-action';
import Wrapper from '@/app/portal/admin/wrapper';
import {getClassAssignmentById} from "@/_actions/class-assignment-action";

export default async function EditClassAssignment({
                                                      params
                                                  }: {
    params: { courseId: string; classId: string, assignmentId: string }
}) {
    const lesson = await getClassAssignmentById(params.courseId, params.classId, params.assignmentId);

    return (
        <>
            <AdminHeader title='Edit Lesson'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditLessonForm lesson={lesson as any} courseId={params.courseId}/>
            </Wrapper>
        </>
    );
} 