'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {updateClass} from '@/_actions/class-action';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useState} from 'react';

interface EditClassFormProps {
    classData: any;
    courseId: string;
}

export default function EditClassForm({classData, courseId}: EditClassFormProps) {
    const router = useRouter();
    const [name, setName] = useState(classData.name);

    const {execute: executeUpdate, status} = useAction(updateClass, {
        onSuccess: (response: any) => {
            if (response?.data?.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Class updated successfully');
            router.push(`/portal/admin/courses/${courseId}/classes`);
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.error.serverError || 'Failed to update class');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please fill in all required fields');
            return;
        }

        executeUpdate({
            courseId: Number(courseId),
            classId: classData.classId,
            title: name,
        });
    };

    return (
        <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium'>
                    Name
                </label>
                <Input
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter class name'
                />
            </div>

            <Button
                type='submit'
                disabled={status === 'executing'}
                className={cn(
                    'bg-navy hover:bg-navy/80',
                    status === 'executing' && 'opacity-50 cursor-not-allowed'
                )}
            >
                Update
            </Button>
        </form>
    );
} 