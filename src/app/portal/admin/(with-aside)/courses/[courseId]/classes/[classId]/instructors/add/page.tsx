import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import Wrapper from '@/app/portal/admin/wrapper';
import AddInstructorForm from '../_components/add-instructor-form';
import {getPublicUsers} from "@/_actions/user-action";

export default async function AddInstructor({params}: { params: { courseId: string, classId: string } }) {
    const users = await getPublicUsers();

    return (
        <>
            <AdminHeader title='Add Instructor'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <AddInstructorForm courseId={params.courseId} classId={params.classId} users={users}/>
            </Wrapper>
        </>
    );
}
