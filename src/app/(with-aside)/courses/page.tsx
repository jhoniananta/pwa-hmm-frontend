
import {
  getEnrolledCourses as courses_action,
  getCourses,
} from '@/_actions/courses-action';

import ClientPage from './client-page';

export const dynamic = 'force-dynamic';

const CoursesPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const enrolled_courses = await courses_action();
  const all_courses = await getCourses();
  const isAllCourse = searchParams['all'] === 'true';
  const courses = isAllCourse ? all_courses : enrolled_courses;

  return (
    <div className='w-full h-full'>
      <ClientPage courses={courses} isAllCourse={isAllCourse} />
    </div>
  );
};

export const metadata = {
  title: 'Courses',
};

export default CoursesPage;
