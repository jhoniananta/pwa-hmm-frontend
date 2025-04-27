import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import React from 'react';
import ScholarshipInternalDetails from './scholarship-internal-details';
import { getScholarshipForm } from '@/_actions/scholarship-action';

export default async function DetailInternalScholarshipAdmin({
  params,
}: {
  params: { submissionId: string };
}) {
  const scholarshipData = await getScholarshipForm();
  const validData = Array.isArray(scholarshipData) ? scholarshipData : [];

  // Get submissionId from params and convert to number
  const submissionIdParam = params.submissionId;
  const targetSubmissionId = parseInt(submissionIdParam, 10);

  // Find the specific scholarship data for the given submissionId
  const userData = validData.find(
    (item) => item.submissionId === targetSubmissionId
  );

  if (!userData) {
    return (
      <>
        <AdminHeader title='Internal Scholarship Details' />
        <div className='flex justify-between items-center mb-4'>
          <AdminBreadcrumb />
        </div>
        <div>Scholarship details not found for this submission.</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title='Internal Scholarship Details' />
      <div className='flex justify-between items-center mb-4'>
        <AdminBreadcrumb />
      </div>
      <ScholarshipInternalDetails data={userData} />
    </>
  );
}
