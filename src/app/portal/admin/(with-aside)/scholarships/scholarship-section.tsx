'use client';

import CustomLink from '@/components/admin/custom-link';
import ScholarshipTable from './table';
import Search from '@/components/client/search';
import {useState} from 'react';
import useDebounce from '@/hooks/useDebounce';
import {ScholarshipResponse} from "@/_actions/scholarship-action";

export default function ScholarshipSection({
                                               data
                                           }: {
    data: ScholarshipResponse[]
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery);

    const filteredData = data.filter((scholarship) =>
        scholarship.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <>
            <div className="w-full flex flex-col md:flex-row justify-between gap-4 md:items-center mb-4">
                <Search
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    className="w-full md:w-[300px]"
                />
                <CustomLink href={'scholarships/add'} className='self-end md:self-auto'>Add Scholarship</CustomLink>
            </div>
            {filteredData.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                    No scholarships found
                </div>
            ) : (
                <ScholarshipTable data={filteredData}/>
            )}
        </>
    );
} 