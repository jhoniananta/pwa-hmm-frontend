'use client';

import React, {useState} from 'react'; // Removed useMemo
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import Pagination from '@/components/client/pagination';
import Wrapper from '@/app/portal/admin/wrapper';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {ScholarshipResponseForm} from '@/_actions/scholarship-action';
import {ResponseItem} from 'lms-types';


export default function InternalScholarshipTable({
                                                     data,
                                                 }: {
    data: ScholarshipResponseForm[];
}) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Ensure data is an array, default to empty array if not
    const validData = Array.isArray(data) ? data : [];

    // 1. Paginate the original data
    const totalPage = Math.ceil(validData.length / itemsPerPage);
    const paginatedData = validData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Function to extract specific field value from responseItems
    const getResponseValue = (
        items: ResponseItem[] | undefined,
        fieldName: string
    ): string => {
        // Handle cases where items might be undefined or not an array
        if (!Array.isArray(items)) {
            return '-';
        }
        const item = items.find((i) => i.field === fieldName);
        return item?.value || '-'; // Return value or '-' if not found
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Angkatan</TableHead>
                        <TableHead>Funding</TableHead>
                        <TableHead>Nominal</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* 2. Map over the paginated original data */}
                    {paginatedData.map((scholarship, index) => (
                        // Use submissionId as the key, fallback to index if needed
                        <TableRow key={scholarship.submissionId ?? index}>
                            {/* Extract all fields using getResponseValue */}
                            <TableCell>
                                {getResponseValue(scholarship.responseItems, 'namaMahasiswa')}
                            </TableCell>
                            <TableCell>
                                {getResponseValue(scholarship.responseItems, 'nim')}
                            </TableCell>
                            <TableCell>
                                {getResponseValue(scholarship.responseItems, 'angkatan')}
                            </TableCell>
                            <TableCell>
                                {getResponseValue(
                                    scholarship.responseItems,
                                    'penawaranBeasiswa'
                                )}
                            </TableCell>
                            <TableCell>
                                {getResponseValue(scholarship.responseItems, 'rincianBiaya')}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`/portal/admin/scholarships/internal-scholarship/details/${scholarship.submissionId}`}
                                    passHref
                                >
                                    <Button className='w-full'>Details</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination based on original data length */}
            {totalPage > 1 && (
                <Pagination
                    page={page} // Ensure prop names match your Pagination component
                    totalPage={totalPage}
                    setPage={setPage} // Ensure prop names match your Pagination component
                />
            )}
        </Wrapper>
    );
}
