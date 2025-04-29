import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import {getTags} from "@/_actions/tag-action";
import TagSection from "@/app/portal/admin/(with-aside)/tags/tag-section";

export const dynamic = 'force-dynamic';

export default async function Tags() {
    const tags = await getTags();

    return (
        <>
            <AdminHeader title='Tags'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
            </div>
            <TagSection data={tags}/>
        </>
    );
} 