'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover';
import {Ellipsis} from 'lucide-react';
import Pagination from '@/components/client/pagination';
import Wrapper from '@/app/portal/admin/wrapper';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import Link from 'next/link';
import {CategoryResponse, deleteCategory} from "@/_actions/category-action";

function CategoryTable({data}: { data: CategoryResponse[] }) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPage = Math.ceil(data.length / itemsPerPage);

    const {execute: executeDelete} = useAction(deleteCategory, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Category deleted successfully');
        },
        onError: (error) => {
            toast.error(error.error.serverError || 'Failed to delete category');
        },
    });


    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((category, index) => {
                        let param = `?test=ok`
                        for (const key in category) {
                            if (category.hasOwnProperty(key)) {
                                // @ts-ignore
                                param += `&${key}=${category[key] || ''}`;
                            }
                        }

                        if (
                            index < (page - 1) * itemsPerPage ||
                            index >= page * itemsPerPage
                        )
                            return null;

                        return (
                            <TableRow
                                key={category.categoryId}
                                className='even:bg-navy/5 odd:bg-transparent'
                            >
                                <TableCell>{category.title || ''}</TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Ellipsis size={20}/>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align='end'
                                            className='w-40 border-navy border p-1'
                                        >
                                            <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                <h3 className='font-bold text-sm p-2'>Action</h3>
                                                <Link
                                                    href={
                                                        `/portal/admin/categories/edit/${category.categoryId}/${param}`
                                                    }
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        executeDelete({
                                                            categoryId: category.categoryId,
                                                        })
                                                    }
                                                    className='hover:bg-navy/40 p-2 rounded-md transition text-left'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination page={page} setPage={setPage} totalPage={totalPage}/>
        </Wrapper>
    );
}

export default CategoryTable;
