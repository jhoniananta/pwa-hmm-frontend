import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import { getCourses } from '@/_actions/courses-action';
import CourseSection from './course-section';

export const dynamic = 'force-dynamic';

export default async function Courses() {
  const courses = await getCourses();
  return (
    <>
      <AdminHeader title='Courses' />
      <div className='flex justify-between items-center'>
        <AdminBreadcrumb />
      </div>
      <CourseSection data={courses} />
    </>
  );
}
