import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import { getScholarshipForm } from '@/_actions/scholarship-action';
import ScholarshipInternalSection from './scholarship-internal-section';
export default async function InternalScholarshipAdminPage() {
  const scholarshipData = await getScholarshipForm();
  // Basic error handling or check if data is valid array might be good here
  const validData = Array.isArray(scholarshipData) ? scholarshipData : [];

  return (
    <>
      <AdminHeader title='Internal Scholarship' />
      <div className='flex justify-between items-center mb-4'>
        {' '}
        {/* Added margin-bottom */}
        <AdminBreadcrumb />
      </div>
      <ScholarshipInternalSection data={validData} />
    </>
  );
}
