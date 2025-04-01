import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import { getClasses } from '@/_actions/class-action';
import ClassSection from './class-section';
import { PlusIcon } from 'lucide-react';
import CustomLink from '@/components/admin/custom-link';

export const dynamic = 'force-dynamic';

export default async function Classes({ params }: { params: { courseId: string } }) {
  const classes = await getClasses(Number(params.courseId));
  
  return (
    <>
      <AdminHeader title='Classes' />
      <div className='flex justify-between items-center'>
        <AdminBreadcrumb />
        <CustomLink href={`/portal/admin/courses/${params.courseId}/classes/add`}>
          <div className='flex items-center'>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Class
          </div>
        </CustomLink>
      </div>
      <ClassSection data={classes} courseId={params.courseId} />
    </>
  );
} 