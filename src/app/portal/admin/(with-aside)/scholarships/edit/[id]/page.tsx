import {z} from 'zod';
import {updateScholarshipSchema} from '@/lib/schema';
import EditScholarshipForm from './edit-scholarship-form';
import {getScholarshipById} from '@/_actions/scholarship-action';
import {getTags} from '@/_actions/tag-action';
import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import {dateToMinutePrecisionString, fromUTCToGMT7} from "@/_actions/utils/utils";

export default async function Page({params}: { params: { id: string } }) {
    const idNum = Number(params.id);
    const scholarship = await getScholarshipById(idNum);
    const tagsAll = await getTags();

    const defaultValues: z.infer<typeof updateScholarshipSchema> = {
        scholarshipId: scholarship.scholarshipId,
        title: scholarship.title,
        description: scholarship.description,
        provider: scholarship.provider,
        deadline: dateToMinutePrecisionString(fromUTCToGMT7(new Date(scholarship.deadline))),
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