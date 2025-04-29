'use client';

import CustomLink from '@/components/admin/custom-link';
import Search from '@/components/client/search';
import {useState} from 'react';
import useDebounce from '@/hooks/useDebounce';
import {CategoryResponse} from "@/_actions/category-action";
import CategoryTable from "./table";

export default function CategorySection({
                                            data,
                                        }: {
    data: CategoryResponse[];
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery);

    const filteredData = data.filter(
        (category) =>
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
                        href={'categories/add'}
                        className='self-end md:self-auto'
                    >
                        Add Category
                    </CustomLink>
                </div>
            </div>
            {filteredData.length === 0 ? (
                <div className='text-center text-muted-foreground mt-8'>
                    No category found
                </div>
            ) : (
                <CategoryTable data={filteredData}/>
            )}
        </>
    );
}
