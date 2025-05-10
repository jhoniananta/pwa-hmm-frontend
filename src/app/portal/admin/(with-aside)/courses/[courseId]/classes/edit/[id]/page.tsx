import React from 'react';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import ManageTable from '@/app/portal/admin/manage-table';
import {TableCell, TableRow} from '@/components/ui/table';
import Link from 'next/link';
import {Pencil} from 'lucide-react';
import {ClassResponse, getClassById} from "@/_actions/class-action";
import Wrapper from "@/app/portal/admin/wrapper";
import EditClassForm from "@/app/portal/admin/(with-aside)/courses/[courseId]/classes/_components/edit-class-form";

export default async function Page({params}: { params: { id: string, courseId: string } }) {
    const {id, courseId} = params
    const classResponse: ClassResponse = await getClassById(Number(courseId), Number(id))

    return (
        <>
            <AdminHeader title='Edit Class'/>
            <AdminBreadcrumb/>
            <div className={'flex-2'}>
                <Wrapper>
                    <EditClassForm classData={classResponse} courseId={courseId as string}/>
                </Wrapper>
            </div>
            <div className={'flex-2'}>
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
            </div>
        </>
    );
}