import {z} from 'zod';
import {updateScholarshipSchema} from '@/lib/schema';
import EditScholarshipForm from './edit-scholarship-form';
import {getScholarshipById} from '@/_actions/scholarship-action';
import {getTags} from '@/_actions/tag-action';
import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';

export default async function Page({params}: { params: { id: string } }) {
    const idNum = Number(params.id);
    const scholarship = await getScholarshipById(idNum);
    const tagsAll = await getTags();

    const defaultValues: z.infer<typeof updateScholarshipSchema> = {
        scholarshipId: scholarship.scholarshipId,
        title: scholarship.title,
        description: scholarship.description,
        provider: scholarship.provider,
        deadline: new Date(scholarship.deadline).toISOString(),
        reference: scholarship.reference,
        tags: scholarship.tags.map((t) => t.tagId),
    };

    return (
        <>
            <AdminHeader title="Edit Scholarship"/>
            <AdminBreadcrumb/>
            <EditScholarshipForm
                tags={tagsAll}
                defaultValues={defaultValues}
            />
        </>
    );
}