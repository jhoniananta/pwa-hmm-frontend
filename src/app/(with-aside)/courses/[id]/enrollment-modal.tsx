'use client';

import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import MotionFramer from '@/components/client/modal-framer';
import MotionOverlay from '@/components/client/modal-overlay';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {useAction} from 'next-safe-action/hooks';
import {createEnrollment, deleteEnrollment, EnrollmentResponse} from '@/_actions/enrollment-action';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import validationErrorToString from "@/lib/validationErrorToString";
import {MinusSquare, PlusSquare} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {createEnrollmentSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClassResponse} from "@/_actions/class-action";

export default function EnrollmentModal({
                                            courseId,
                                            courseTitle,
                                            classes,
                                            enrollments,
                                            defaultValues
                                        }: {
    courseId: number;
    courseTitle: string;
    classes: ClassResponse[],
    enrollments: EnrollmentResponse[],
    defaultValues: z.infer<typeof createEnrollmentSchema>
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [classId, setClassId] = useState<number | undefined>();
    const router = useRouter();

    const {execute: executeCreate, isExecuting: createStatus} = useAction(createEnrollment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Successfully created enrollment');
            setIsOpen(false);
        },
        onError: ({error: validationErrors}) => {
            toast.error(validationErrorToString(validationErrors) || 'Failed to create enrollment');
        },
    });

    const {execute: executeDelete, isExecuting: deleteStatus} = useAction(deleteEnrollment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Successfully deleted enrollment');
            setIsOpen(false);
        },
        onError: ({error: validationErrors}) => {
            toast.error(validationErrorToString(validationErrors) || 'Failed to delete enrollment');
        },
    });

    const handleEnroll = () => {
        if (!classId) {
            toast.error('Please select a class');
            return;
        }
        executeCreate({courseId, classId});
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof createEnrollmentSchema>>({
            resolver: zodResolver(createEnrollmentSchema),
            defaultValues
        }
    );

    const handleCreateEnrollment = (classId: number) => {
        executeCreate({
            courseId,
            classId,
        });
    };

    const handleDeleteEnrollment = (classId: number) => {
        executeDelete({
            courseId,
            classId,
        });
    };


    return (
        <>

            <form className='space-y-4'>
                <div>
                    <Label>Available Classes</Label>
                    <div className='mt-2 space-y-2 rounded-md border p-4'>
                        {classes.length ? (
                            classes.map((theClass: ClassResponse) => {
                                const selected =
                                    Array.isArray(defaultValues.classes) &&
                                    defaultValues.classes.includes(theClass.classId);

                                return (
                                    <div
                                        key={theClass.classId}
                                        className='flex items-center justify-between'
                                    >
                                        <span>{theClass.title}</span>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() =>
                                                selected
                                                    ? handleDeleteEnrollment(theClass.classId)
                                                    : handleCreateEnrollment(theClass.classId)
                                            }
                                            disabled={createStatus || deleteStatus}
                                            aria-label={
                                                selected
                                                    ? `Remove enrollment ${theClass.title}`
                                                    : `Add enrollment ${theClass.title}`
                                            }
                                        >
                                            {selected ? (
                                                <MinusSquare className='h-5 w-5 text-red-500'/>
                                            ) : (
                                                <PlusSquare className='h-5 w-5 text-green-500'/>
                                            )}
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className='text-sm text-muted-foreground'>
                                No classes available.
                            </p>
                        )}
                    </div>
                </div>
            </form>

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