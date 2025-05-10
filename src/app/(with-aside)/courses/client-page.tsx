'use client';

import Search from '@/components/client/search';
import CoursesItem from '@/app/(with-aside)/courses/item';
import Link from 'next/link';
import CourseDialog from './dialog';
import {useState} from 'react';
import {CourseResponse} from "@/_actions/courses-action";

interface ClientPageProps {
    courses: CourseResponse[];
    isAllCourse: boolean;
}

const ClientPage = ({courses, isAllCourse}: ClientPageProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const images = [
        '/assets/images/mesin.png',
        '/assets/images/pengukuran.png',
        '/assets/images/pipe_system.png',
        '/assets/images/printer.png',
    ];

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className='flex justify-between flex-col md:flex-row gap-4'>
                <Search
                    query={searchQuery}
                    setQuery={setSearchQuery}
                />
                <div className='flex gap-4 md:gap-6'>
                    <Link
                        href={'?'}
                        className={`rounded-full flex items-center md:py-2 md:px-4 py-1.5 px-3 hover:bg-kuning transition drop-shadow-lg font-semibold hover:text-navy md:text-sm text-xs ${
                            isAllCourse ? 'bg-navy text-white' : 'bg-kuning text-navy'
                        }`}
                    >
                        My Courses
                    </Link>
                    <Link
                        href={'?all=true'}
                        className={`rounded-full flex items-center md:py-2 md:px-4 py-1.5 px-3 hover:bg-kuning transition drop-shadow-lg font-semibold hover:text-navy md:text-sm text-xs ${
                            isAllCourse ? 'bg-kuning text-navy' : 'bg-navy text-white'
                        }`}
                    >
                        All Courses
                    </Link>
                    <CourseDialog/>
                </div>
            </div>
            {filteredCourses.length === 0 && (
                <p className='text-muted-foreground text-center w-full font-medium py-6'>
                    No courses available
                </p>
            )}
            <div
                className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 lg:gap-x-10 md:gap-y-10 flex-1 grid-rows-2 mt-5'>
                {filteredCourses.map((course, i: number) => (
                    <CoursesItem
                        href=''
                        key={i}
                        id={course.courseId}
                        title={course.title}
                        image={course.image}
                        subject={'MS2021'}
                        numberOfMaterials={course.numberOfLessons}
                        numberOfVideos={course.numberOfVideos}
                    />
                ))}
            </div>
        </>
    );
};

export default ClientPage; 