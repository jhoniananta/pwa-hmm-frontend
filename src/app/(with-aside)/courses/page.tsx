import {CategoryResponse, CourseResponse, getCourses, getEnrolledCourses} from '@/_actions/courses-action';

import ClientPage from './client-page';
import {getPublicUrl} from "@/_actions/utils/utils";
import {getCategories} from "@/_actions/category-action";

export const dynamic = 'force-dynamic';


const CoursesPage = async ({
                               searchParams,
                           }: {
    searchParams: Record<string, string>;
}) => {
    let courses: CourseResponse[] = []
    const isAllCourse = searchParams['all'] === 'true';
    const isWatch = searchParams['watch'] === 'true';
    const isEnroll = searchParams['enroll'] === 'true';
    if (isAllCourse) {
        courses = await getCourses();
    } else {
        courses = await getEnrolledCourses();
    }

    const categories: CategoryResponse[] = await getCategories()

    return (
        <div className='w-full h-full'>
            <ClientPage
                courses={
                    courses.map((course) => {
                        course.image = getPublicUrl(course.image);
                        return course
                    })}
                isWatch={isWatch}
                isEnroll={isEnroll}
                categories={categories}
                isAllCourse={isAllCourse}
            />
        </div>
    );
};

export const metadata = {
    title: 'Courses',
};

export default CoursesPage;
