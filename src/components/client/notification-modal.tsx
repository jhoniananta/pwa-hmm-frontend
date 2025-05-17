import React, {useEffect, useRef, useState} from 'react';
import {X} from 'lucide-react';
import Image from 'next/image';
import {getNotifications, NotificationResponse} from "@/_actions/notification-action";
import Link from 'next/link';

export type Notification = {
    id: number;
    division: string;
    message: string;
    date: string; // e.g. '25 Maret 2025'
    time?: string; // e.g. '13.00 WIB'
    avatarUrl?: string;
};

// export const dummyNotifications: Notification[] = [
//     {
//         id: 1,
//         division: 'Badan Kesenatoran HMM ITB',
//         message:
//             'telah menambahkan pemberitahuan terbaru terkait hasil kajian terhadap isu kemahasiswaan!',
//         date: '25 Maret 2025',
//         time: '13.00 WIB',
//         avatarUrl: 'https://via.placeholder.com/40/FF0000/000000?text=BK',
//     },
// ];

interface NotificationModalProps {
    open: boolean;
    onClose: () => void;
    data?: Notification[];
}

let notifications: NotificationResponse[] = []

export default function NotificationModal({
                                              open,
                                              onClose,
                                              data = notifications,
                                          }: NotificationModalProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const containerRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([])

    // load next batch
    const loadMore = () => {
        setVisibleCount((v) => Math.min(v + 6, data.length));
    };

    useEffect(() => {
        const fetchData = async () => {
            const notificationResult = await getNotifications();
            setNotifications(notificationResult);
        };
        fetchData()
    })

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
                if (visibleCount < data.length) loadMore();
            }
        };
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [visibleCount, data.length]);

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
                    <h2 className='font-semibold text-lg'>Notification</h2>
                    <button onClick={onClose} className='p-1 rounded hover:bg-gray-200'>
                        <X size={18}/>
                    </button>
                </div>
                <div
                    ref={containerRef}
                    className='max-h-96 overflow-y-auto flex flex-col gap-4 px-4 py-2'
                >
                    {notifications.slice(0, visibleCount).map((n) => (
                        <Link href={n.redirect ?? ""} passHref>
                            <div
                                key={n.notificationId}
                                className='flex items-center gap-4 py-2 hover:bg-blue-50 rounded'
                            >
                                <Image
                                    src={'https://myhmm-bucket.s3.ap-southeast-3.amazonaws.com/public/logo.png'}
                                    alt={n.title}
                                    width={40}
                                    height={40}
                                    className='rounded-full object-cover'
                                    unoptimized={true}
                                />
                                <div className='flex-1'>
                                    <div className='text-xs text-gray-500'>
                                        {`${new Date(Math.floor(n.notificationId / 1000)).toLocaleDateString()} ${new Date(Math.floor(n.notificationId / 1000)).toLocaleTimeString()}`}
                                    </div>
                                    <div className='font-medium'>{n.title}</div>
                                    <p className='text-sm text-gray-700'>{n.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='px-4 py-2 border-t text-center'>
                    {visibleCount < data.length ? (
                        <button
                            onClick={loadMore}
                            className='text-sm text-blue-600 hover:underline'
                        >
                            See more content
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className='text-sm text-blue-600 hover:underline'
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
