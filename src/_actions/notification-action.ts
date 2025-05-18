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

export const getNotifications = async (param?: { limit?: number, lastEvaluatedId?: number }) => {
    return (fetchAction<NotificationResponse[]>(
        '/notifications',
        'Failed to fetch notifications',
        {queryParams: {limit: param?.limit, lastEvaluatedId: param?.lastEvaluatedId}}
    )());
}


