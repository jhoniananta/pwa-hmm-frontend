import {CourseResponse, getCourses, getEnrolledCourses} from '@/_actions/courses-action';

import ClientPage from './client-page';
import {getPublicUrl} from "@/_actions/utils/utils";

export const dynamic = 'force-dynamic';


const CoursesPage = async ({
                               searchParams,
                           }: {
    searchParams: Record<string, string>;
}) => {
    let courses: CourseResponse[] = []
    const isAllCourse = searchParams['all'] === 'true';
    if (isAllCourse) {
        courses = await getCourses();
    } else {
        courses = await getEnrolledCourses();
    }

    return (
        <div className='w-full h-full'>
            <ClientPage
                courses={
                    courses.map((course) => {
                        course.image = getPublicUrl(course.image);
                        return course
                    })}
                isAllCourse={isAllCourse}
            />
        </div>
    );
};

export const metadata = {
    title: 'Courses',
};

export default CoursesPage;
