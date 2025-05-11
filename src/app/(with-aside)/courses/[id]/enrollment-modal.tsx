'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {useAction} from 'next-safe-action/hooks';
import {createEnrollment, deleteEnrollment, EnrollmentResponse} from '@/_actions/enrollment-action';
import {toast} from 'sonner';
import validationErrorToString from "@/lib/validationErrorToString";
import {MinusSquare, PlusSquare} from "lucide-react";
import {z} from "zod";
import {createEnrollmentSchema} from "@/lib/schema";
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
    const [enrolledClasses, setEnrolledClasses] = useState<number[]>(
        defaultValues.classes || []
    );

    const {execute: executeCreate, isExecuting: createStatus} = useAction(createEnrollment, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Successfully created enrollment');
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
        },
        onError: ({error: validationErrors}) => {
            toast.error(validationErrorToString(validationErrors) || 'Failed to delete enrollment');
        },
    });

    const handleCreateEnrollment = (classId: number) => {
        executeCreate({
            courseId,
            classId,
        });
        setEnrolledClasses((prev) => [...prev, classId]);
    };

    const handleDeleteEnrollment = (classId: number) => {
        executeDelete({
            courseId,
            classId,
        });
        setEnrolledClasses((prev) => prev.filter(id => id !== classId));
    };


    return (
        <>
            <div>
                <Label>Available Classes</Label>
                <div className='mt-2 space-y-2 rounded-md border p-4'>
                    {classes.length ? (
                        classes.map((theClass: ClassResponse) => {
                            const selected = enrolledClasses.includes(theClass.classId);
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
        </>
    );
}