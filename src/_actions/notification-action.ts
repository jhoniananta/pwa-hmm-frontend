'use server';

import {fetchAction} from '@/lib/fetch';

export type  NotificationResponse = {
    userId: number;
    notificationId: number;
    redirect?: string;
    isSeen: boolean;
    title: string;
    description?: string;
}

export const getNotifications = fetchAction<NotificationResponse[]>(
    '/notifications',
    'Failed to fetch notifications',
    {tags: ['notifications'], cache: 'no-cache'}
);


