import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

export type Notification = {
  id: number;
  division: string;
  message: string;
  date: string; // e.g. '25 Maret 2025'
  time?: string; // e.g. '13.00 WIB'
  avatarUrl?: string;
};

export const dummyNotifications: Notification[] = [
  {
    id: 1,
    division: 'Badan Kesenatoran HMM ITB',
    message:
      'telah menambahkan pemberitahuan terbaru terkait hasil kajian terhadap isu kemahasiswaan!',
    date: '25 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/FF0000/000000?text=BK',
  },
  {
    id: 2,
    division: 'DPA HMM ITB',
    message:
      'telah menambahkan pemberitahuan terbaru terkait regulasi Pemilu HMM ITB Tahun 2025!',
    date: '25 Maret 2025',
    time: '12.50 WIB',
    avatarUrl: 'https://via.placeholder.com/40/00BFFF/000000?text=DPA',
  },
  {
    id: 3,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 4,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 5,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 6,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 7,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 8,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
  {
    id: 9,
    division: 'Divisi Akademik',
    message:
      'telah menambahkan konten baru di kelas Perpindahan Panas dan Massa!',
    date: '21 Maret 2025',
    time: '13.00 WIB',
    avatarUrl: 'https://via.placeholder.com/40/32CD32/000000?text=DA',
  },
];

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  data?: Notification[];
}

export default function NotificationModal({
  open,
  onClose,
  data = dummyNotifications,
}: NotificationModalProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);

  // load next batch
  const loadMore = () => {
    setVisibleCount((v) => Math.min(v + 6, data.length));
  };

  // infinite‐scroll on container
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
            <X size={18} />
          </button>
        </div>
        <div
          ref={containerRef}
          className='max-h-96 overflow-y-auto flex flex-col gap-4 px-4 py-2'
        >
          {data.slice(0, visibleCount).map((n) => (
            <div
              key={n.id}
              className='flex items-center gap-4 py-2 hover:bg-blue-50 rounded'
            >
              <Image
                src={n.avatarUrl!}
                alt={n.division}
                width={40}
                height={40}
                className='rounded-full object-cover'
              />
              <div className='flex-1'>
                <div className='text-xs text-gray-500'>
                  {n.date}
                  {n.time && ' - ' + n.time}
                </div>
                <div className='font-medium'>{n.division}</div>
                <p className='text-sm text-gray-700'>{n.message}</p>
              </div>
            </div>
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
