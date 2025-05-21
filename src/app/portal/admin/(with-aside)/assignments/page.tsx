import AdminHeader from '@/components/admin/header';
import {getUserManagedClasses} from '@/_actions/courses-action';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AssignmentSection from './assignment-section';

export const dynamic = 'force-dynamic';

export default async function Assignments() {
    const userManagedClasses = await getUserManagedClasses();

    return (
        <>
            <AdminHeader title='Assignments'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
            </div>
            <AssignmentSection data={userManagedClasses}/>
        </>
    );
}

export const metadata = {
    title: 'Assignments',
};
