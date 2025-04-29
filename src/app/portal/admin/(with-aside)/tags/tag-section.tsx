'use client';

import CustomLink from '@/components/admin/custom-link';
import TagTable from './table';
import Search from '@/components/client/search';
import {useState} from 'react';
import useDebounce from '@/hooks/useDebounce';
import {TagResponse} from "@/_actions/tag-action";

export default function TagSection({
                                       data,
                                   }: {
    data: TagResponse[];
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery);

    const filteredData = data.filter(
        (tag) =>
            // scholarship.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            // scholarship.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
            true
    );

    return (
        <>
            <div className='w-full flex flex-col md:flex-row justify-between gap-4 md:items-center mb-4'>
                <Search
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    className='w-full md:w-[300px]'
                />
                <div className='flex flex-col md:flex-row gap-2 md:gap-4 justify-end'>
                    <CustomLink
                        href={'tags/add'}
                        className='self-end md:self-auto'
                    >
                        Add Tag
                    </CustomLink>
                </div>
            </div>
            {filteredData.length === 0 ? (
                <div className='text-center text-muted-foreground mt-8'>
                    No tag found
                </div>
            ) : (
                <TagTable data={filteredData}/>
            )}
        </>
    );
}
