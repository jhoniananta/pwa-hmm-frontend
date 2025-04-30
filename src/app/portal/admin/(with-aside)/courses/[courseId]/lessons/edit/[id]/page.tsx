import AdminHeader from '@/components/admin/header';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import EditLessonForm from '../../_components/edit-lesson-form';
import {getLessonById} from '@/_actions/lessons-action';
import Wrapper from '@/app/portal/admin/wrapper';
import ManageTable from "@/app/portal/admin/manage-table";
import {TableCell, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {Pencil} from "lucide-react";
import React from "react";

export default async function EditLesson({
                                             params
                                         }: {
    params: { courseId: string; id: string }
}) {
    const lesson = await getLessonById(params.courseId, params.id);

    return (
        <>
            <AdminHeader title='Edit Lesson'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <EditLessonForm lesson={lesson} courseId={params.courseId}/>
            </Wrapper>
            <Wrapper>
                <h2 className='text-lg font-semibold mb-4'>Manage Class</h2>
                <ManageTable>
                    {["videos", "attachments"].map((item, i) => (
                        <TableRow key={item + "-edit-course-admin-page"} className='even:bg-abu-1 odd:bg-white'>
                            <TableCell className='capitalize font-semibold '>{item}</TableCell>
                            <TableCell className='flex justify-end'>
                                <Link href={`/portal/admin/courses/${params.courseId}/lessons/${params.id}/${item}`}
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