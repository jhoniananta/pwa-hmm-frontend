import {getCourses, getEnrolledCourses as courses_action,} from '@/_actions/courses-action';

import ClientPage from './client-page';
import getVerboseStatus from "@/lib/getVerboseStatus";
import {CourseModel} from "lms-types";

export const dynamic = 'force-dynamic';

const CoursesPage = async ({
                               searchParams,
                           }: {
    searchParams: Record<string, string>;
}) => {
    const isVerbose = getVerboseStatus()

    let courses: CourseModel[] = []
    const isAllCourse = searchParams['all'] === 'true';
    if (isAllCourse) {
        courses = await getCourses();
    } else {
        courses = await courses_action();
    }

    return (
        <div className='w-full h-full'>
            <ClientPage courses={courses} isAllCourse={isAllCourse}/>
        </div>
    );
};

export const metadata = {
    title: 'Courses',
};

export default CoursesPage;
