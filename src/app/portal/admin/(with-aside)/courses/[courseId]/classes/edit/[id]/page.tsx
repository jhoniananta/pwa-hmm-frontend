'use client';
import React, {useRef} from 'react';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {updateClassSchema} from '@/lib/schema';
import {z} from 'zod';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import ManageTable from '@/app/portal/admin/manage-table';
import {TableCell, TableRow} from '@/components/ui/table';
import Link from 'next/link';
import {Pencil} from 'lucide-react';
import {updateClass} from "@/_actions/class-action";
import validationErrorToString from "@/lib/validationErrorToString";
import Wrapper from "@/app/portal/admin/wrapper";

export default function Page() {
    const {id, courseId} = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultValues = {
        courseId: Number(courseId),
        classId: Number(id),
        title: searchParams.get('title') || '',
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<z.infer<typeof updateClassSchema>>({
        resolver: zodResolver(updateClassSchema),
        defaultValues,
    });


    const {execute: executeUpdateClass, isExecuting} = useAction(updateClass, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Class updated successfully');
            router.push(`/portal/admin/courses/${courseId}/classes`);
        },
        onError: ({error: {validationErrors, fetchError}}) => {
            toast.error(
                fetchError ||
                validationErrorToString(validationErrors) ||
                'Failed to update class'
            );
        },
    });


    const onSubmit = handleSubmit((data) => {
        executeUpdateClass(data);
    });

    return (
        <>
            <AdminHeader title='Edit Class'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <form className='space-y-4' onSubmit={onSubmit}>
                    <div>
                        <Label>Title</Label>
                        <Input {...register('title')} />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>
                </form>
            </Wrapper>
            <Wrapper>
                <h2 className='text-lg font-semibold mb-4'>Manage Class</h2>
                <ManageTable>
                    {["assignments", "instructors"].map((item, i) => (
                        <TableRow key={item + "-edit-course-admin-page"} className='even:bg-abu-1 odd:bg-white'>
                            <TableCell className='capitalize font-semibold '>{item}</TableCell>
                            <TableCell className='flex justify-end'>
                                <Link href={`/portal/admin/courses/${courseId}/classes/${id}/${item}`}
                                      className='text-blue-500 flex gap-2 items-center'>
                                    <Pencil className='w-4 h-4'/>
                                    Manage</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </ManageTable>
            </Wrapper>
        </>
    );
}