'use client';

import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import MotionFramer from '@/components/client/modal-framer';
import MotionOverlay from '@/components/client/modal-overlay';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {useAction} from 'next-safe-action/hooks';
import {createEnrollment} from '@/_actions/enrollment-action';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import validationErrorToString from "@/lib/validationErrorToString";
import {ClassResponse} from "@/_actions/class-action";

export default function EnrollmentModal({
                                            courseId,
                                            courseTitle,
                                            classes
                                        }: {
    courseId: number;
    courseTitle: string;
    classes: ClassResponse[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [classId, setClassId] = useState<number | undefined>();
    const router = useRouter();

    const {execute, status} = useAction(createEnrollment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Successfully enrolled in course');
            setIsOpen(false);
            router.refresh();
        },
        onError: ({error: validationErrors}) => {
            toast.error(validationErrorToString(validationErrors) || 'Failed to enroll in course');
        },
    });

    const handleEnroll = () => {
        if (!classId) {
            toast.error('Please select a class');
            return;
        }
        execute({courseId, classId});
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className='bg-navy rounded-full font-semibold py-1.5 text-white hover:bg-navy/80 transition px-6 text-sm md:text-base'
            >
                Enroll Now
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <MotionFramer
                        id="enrollment-modal"
                        className='border border-navy'
                    >
                        <div className='flex flex-col gap-4 p-4'>
                            <motion.h3>
                                Enroll in {courseTitle}
                            </motion.h3>

                            <div className='space-y-2'>
                                <Label>Select Class</Label>
                                <Select onValueChange={(value) => setClassId(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your class"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            classes.map((theClass) =>
                                                <SelectItem key={theClass.classId}
                                                            value={String(theClass.classId)}>{theClass.title}</SelectItem>
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className='bg-navy'
                                    onClick={handleEnroll}
                                    disabled={status === 'executing'}
                                >
                                    {status === 'executing' ? 'Enrolling...' : 'Enroll'}
                                </Button>
                            </div>
                        </div>
                    </MotionFramer>
                )}
            </AnimatePresence>

            <MotionOverlay
                show={isOpen}
                setActive={setIsOpen}
                setTo={false}
            />
        </>
    );
} 