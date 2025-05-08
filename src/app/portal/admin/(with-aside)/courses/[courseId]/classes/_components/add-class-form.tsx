'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {createClass} from '@/_actions/class-action';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useState} from 'react';
import validationErrorToString from "@/lib/validationErrorToString";

interface AddClassFormProps {
    courseId: string;
}

export default function AddClassForm({courseId}: AddClassFormProps) {
    const router = useRouter();
    const [name, setName] = useState('');

    const {execute: executeCreate, status} = useAction(createClass, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Class created successfully');
            router.push(`/portal/admin/courses/${courseId}/classes`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to create class');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please fill in all required fields');
            return;
        }

        executeCreate({
            courseId: Number(courseId),
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
                    placeholder='Enter class name (e.g: K01 - Vani Virdyawan)'
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
                Create
            </Button>
        </form>
    );
} 