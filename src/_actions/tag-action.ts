'use server';

import {fetchAction} from '@/lib/fetch';

export type TagResponse = {
    tagId: number,
    title: string
}

export const getTags = fetchAction<TagResponse[]>(
    '/tags',
    'Failed to fetch tags',
    {tags: ['tags'], cache: 'no-cache'}
);

export const getTagById = async (tagId: number) =>
    await fetchAction<TagResponse>(
        `/tags/${tagId}`,
        'Failed to fetch tag',
        {tags: ['tags', `tag-${tagId}`]}
    )();
