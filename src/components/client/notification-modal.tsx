import React, {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import Image from 'next/image';
import {getNotifications, NotificationResponse} from "@/_actions/notification-action";
import Link from 'next/link';

interface NotificationModalProps {
    open: boolean;
    onClose: () => void;
}

const ITEMS_PER_PAGE = 6;

export default function NotificationModal({
                                              open,
                                              onClose,
                                          }: NotificationModalProps) {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [lastEvaluatedId, setLastEvaluatedId] = useState<number | undefined>();
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || notifications.length > 0) return;

        const fetchInitialData = async () => {
            setLoading(true);
            const result = await getNotifications({limit: ITEMS_PER_PAGE});
            if (result.length > 0) {
                setNotifications(result);
                setLastEvaluatedId(result[result.length - 1].notificationId);
                if (result.length < ITEMS_PER_PAGE) setHasMore(false);
            } else {
                setHasMore(false);
            }
            setLoading(false);
        };

        fetchInitialData();
    }, [open]);

    const loadMore = async () => {
        if (!hasMore || loading || !lastEvaluatedId) return;

        setLoading(true);
        const result = await getNotifications({limit: ITEMS_PER_PAGE, lastEvaluatedId});
        if (result.length > 0) {
            setNotifications((prev) => [...prev, ...result]);
            setLastEvaluatedId(result[result.length - 1].notificationId);
            if (result.length < ITEMS_PER_PAGE) setHasMore(false);
        } else {
            setHasMore(false);
        }
        setLoading(false);
    };

    if (!open) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between px-4 py-3 border-b'>
                    <h2 className='font-semibold text-lg'>Notifications</h2>
                    <button onClick={onClose} className='p-1 rounded hover:bg-gray-200'>
                        <X size={18}/>
                    </button>
                </div>

                <div className='max-h-96 overflow-y-auto flex flex-col gap-4 px-4 py-2'>
                    {notifications.map((n) => (
                        <Link href={n.redirect ?? "#"} passHref key={n.notificationId}>
                            <div className='flex items-center gap-4 py-2 hover:bg-blue-50 rounded cursor-pointer'>
                                <Image
                                    src={'https://myhmm-bucket.s3.ap-southeast-3.amazonaws.com/public/logo.png '}
                                    alt={n.title}
                                    width={40}
                                    height={40}
                                    className='rounded-full object-cover'
                                    unoptimized={true}
                                />
                                <div className='flex-1'>
                                    <div className='text-xs text-gray-500'>
                                        {new Date(Math.floor(n.notificationId / 1000)).toLocaleString()}
                                    </div>
                                    <div className='font-medium'>{n.title}</div>
                                    <p className='text-sm text-gray-700'>{n.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {loading && <p className='text-center text-sm text-gray-500 py-2'>Loading...</p>}
                </div>

                <div className='px-4 py-2 border-t text-center'>
                    {hasMore && !loading && (
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className='text-sm text-blue-600 hover:underline disabled:text-gray-400'
                        >
                            {'Load more'}
                        </button>
                    )}
                    {!hasMore && notifications.length > 0 && (
                        <p className='text-sm text-gray-500'>{'No more notification'}</p>
                    )}
                </div>
            </div>
        </div>
    );
}