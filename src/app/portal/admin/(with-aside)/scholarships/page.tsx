import AdminHeader from '@/components/admin/header';
import { getScholarships } from '@/_actions/scholarship-action';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import ScholarshipSection from './scholarship-section';

export const dynamic = 'force-dynamic';

export default async function Scholarships() {
  const scholarships = await getScholarships();
  
  return (
    <>
      <AdminHeader title='Scholarships' />
      <div className='flex justify-between items-center'>
        <AdminBreadcrumb />
      </div>
      <ScholarshipSection data={scholarships} />
    </>
  );
} 