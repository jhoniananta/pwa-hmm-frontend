import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import {getCategories} from "@/_actions/category-action";
import CategorySection from "@/app/portal/admin/(with-aside)/categories/category-section";

export const dynamic = 'force-dynamic';

export default async function Categories() {
    const categories = await getCategories();

    return (
        <>
            <AdminHeader title='Categories'/>
            <div className='flex justify-between items-center'>
                <AdminBreadcrumb/>
            </div>
            <CategorySection data={categories}/>
        </>
    );
} 