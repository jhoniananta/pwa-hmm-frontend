'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import validationErrorToString from "@/lib/validationErrorToString";
import {PublicUserResponse} from "@/_actions/user-action";
import {createInstructor} from "@/_actions/instructors-action";

interface AddInstructorFormProps {
    users: PublicUserResponse[]
    courseId: string;
    classId: string;
}

export default function AddInstructorForm({users, courseId, classId}: AddInstructorFormProps) {
    const router = useRouter();
    const [userId, setUserId] = useState(-1);

    const {execute: executeCreate, status} = useAction(createInstructor, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Instructor created successfully');
            router.push(`/portal/admin/courses/${courseId}/classes/${classId}/instructors`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to create instructor');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) {
            toast.error('user is required');
            return;
        }

        executeCreate({
            courseId: Number(courseId),
            classId: Number(classId),
            userId,
        });
    };

    return (
        <form onSubmit={onSubmit} className='space-y-6'>
            <div>
                <Label>Task type</Label>
                <Select
                    onValueChange={(value) => setUserId(Number(value))}
                    defaultValue={'-1'}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select user"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={(-1).toString()}>Select User</SelectItem>
                        {
                            users.map((user) => <SelectItem
                                key={user.userId}
                                value={user.userId.toString()}>{`${user.email.split('@')[0]} - ${user.name}`}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>

            <Button
                type='submit'
                disabled={status === 'executing' || userId === -1}
                className={cn(
                    'bg-navy hover:bg-navy/80',
                    status === 'executing' && 'opacity-50 cursor-not-allowed'
                )}
            >
                Add
            </Button>
        </form>
    );
} 