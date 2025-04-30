import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditScheduleForm from '../../_components/edit-schedule-form';
import Wrapper from '@/app/portal/admin/wrapper';
import {getCourseScheduleById} from "@/_actions/schedule-action";

export default async function EditSchedule({
                                               params
                                           }: {
    params: { courseId: string; scheduleId: string }
}) {
    const schedule = await getCourseScheduleById(params.courseId, params.scheduleId);
    return (
        <>
            <AdminHeader title='Edit Schedule'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditScheduleForm schedule={schedule} courseId={params.courseId} scheduleId={params.scheduleId}/>
            </Wrapper>
        </>
    );
} 