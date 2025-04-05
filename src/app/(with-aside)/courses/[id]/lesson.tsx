'use client';

import {AnimatePresence, motion} from 'framer-motion';
import MotionFramer from '@/components/client/modal-framer';
import Link from 'next/link';
import {Book} from 'lucide-react';
import {useState} from 'react';
import {Separator} from '@/components/ui/separator';
import {cn} from '@/lib/utils';
import MotionOverlay from '@/components/client/modal-overlay';

export default function Lesson({
                                   lessonId,
                                   params,
                                   lessons,
                               }: {
    lessonId: string;
    params: string;
    lessons: object[];
}) {
    const [active, setActive] = useState(false);
    return (
        <>
            <motion.button
                className='fixed z-20 rounded-xl bg-navy text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold bottom-6 right-4 flex gap-2 items-center'
                onClick={() => setActive(true)}
                aria-haspopup='true'
                layoutId={'lesson-modal'}
            >
                <Book className='w-4 h-4 md:w-6 md:h-6'/>
                <motion.span layoutId='all-materials-lesson'>All Materials</motion.span>
            </motion.button>
            <AnimatePresence>
                {active && (
                    <MotionFramer
                        id={'lesson-modal'}
                        className='border border-navy'
                    >
                        <div className='flex flex-col gap-2'>
                            <motion.h3 layoutId='all-materials-lesson'>
                                All Materials
                            </motion.h3>
                            <Separator/>
                            <ul className='flex flex-col gap-1'>
                                {lessons.map((lesson: any) => (
                                    <Link
                                        key={lesson.lessonId}
                                        onClick={() => setActive(false)}
                                        href={`${params}&lessonId=${lesson.lessonId}`}
                                        className={cn(
                                            'rounded-md py-1.5 px-2 border border-navy hover:bg-navy/80 hover:text-white transition-all',
                                            lessonId.toString() === lesson.lessonId.toString() &&
                                            'px-4 bg-navy text-white'
                                        )}
                                    >
                                        {lesson.title}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </MotionFramer>
                )}
            </AnimatePresence>
            <MotionOverlay
                setActive={setActive}
                setTo={false}
                show={active}
            />
        </>
    );
}
