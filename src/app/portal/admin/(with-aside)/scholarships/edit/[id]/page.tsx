import { z } from 'zod';
import { updateScholarshipSchema } from '@/lib/schema';
import EditScholarshipForm from './edit-scholarship-form';
import { getScholarshipById } from '@/_actions/scholarship-action';
import { getTags } from '@/_actions/tag-action';
import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';

export default async function Page({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  const scholarship = await getScholarshipById(idNum);
  const tagsAll = await getTags();

  // Build defaultValues, converting deadline to a Date
  const defaultValues: z.infer<typeof updateScholarshipSchema> = {
    scholarshipId: scholarship.scholarshipId,
    title: scholarship.title,
    description: scholarship.description,
    provider: scholarship.provider,
    // Convert from string to Date if needed
    deadline:
      scholarship.deadline instanceof Date
        ? scholarship.deadline
        : new Date(scholarship.deadline),
    reference: scholarship.reference,
    tags: scholarship.tags.map((t) => t.tagId),
  };

  return (
    <>
      <AdminHeader title="Edit Scholarship" />
      <AdminBreadcrumb />
      <EditScholarshipForm
        tags={tagsAll}
        defaultValues={defaultValues}
      />
    </>
  );
}