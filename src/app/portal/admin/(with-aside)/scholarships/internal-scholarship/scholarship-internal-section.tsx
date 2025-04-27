'use client';

import Search from '@/components/client/search';
import { useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { ScholarshipResponseForm } from '@/_actions/scholarship-action';
import InternalScholarshipTable from './table';
import { ResponseItem } from 'lms-types';

const getResponseValue = (
  items: ResponseItem[] | undefined,
  fieldName: string
): string => {
  if (!Array.isArray(items)) {
    return ''; // Return empty string if items are not valid
  }
  const item = items.find((i) => i.field === fieldName);
  return item?.value || ''; // Return value or empty string if not found
};

export default function ScholarshipInternalSection({
  data,
}: {
  data: ScholarshipResponseForm[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  const filteredData = useMemo(() => {
    // Ensure data is an array before filtering
    if (!Array.isArray(data)) {
      return [];
    }
    // Filter based on values within responseItems
    return data.filter((scholarship) => {
      const name = getResponseValue(scholarship.responseItems, 'namaMahasiswa');
      const nim = getResponseValue(scholarship.responseItems, 'nim');
      const query = debouncedSearch.toLowerCase();

      return (
        name.toLowerCase().includes(query) || nim.toLowerCase().includes(query)
      );
    });
  }, [data, debouncedSearch]); // Re-filter when data or search query changes

  return (
    <>
      <div className='w-full flex flex-col md:flex-row justify-between gap-4 md:items-center mb-4'>
        <Search
          query={searchQuery}
          setQuery={setSearchQuery}
          className='w-full md:w-[300px]'
        />
      </div>
      {filteredData.length === 0 ? (
        <div className='text-center text-muted-foreground mt-8'>
          No scholarships found matching your search.
        </div>
      ) : (
        // Pass the filtered data to the table
        <InternalScholarshipTable data={filteredData} />
      )}
    </>
  );
}
