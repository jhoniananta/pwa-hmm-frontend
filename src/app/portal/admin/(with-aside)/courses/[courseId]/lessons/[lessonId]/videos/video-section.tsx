'use client';

import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Ellipsis} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useAction} from 'next-safe-action/hooks';
import Pagination from "@/components/client/pagination";
import Wrapper from "@/app/portal/admin/wrapper";
import validationErrorToString from "@/lib/validationErrorToString";
import {deleteVideo, VideoResponse} from "@/_actions/videos-action";

interface VideoSectionProps {
    data: VideoResponse[];
    courseId: string;
    lessonId: string
}

export default function VideoSection({data, courseId, lessonId}: VideoSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const videosPerPage = 6;
    const totalPage = Math.ceil(data.length / videosPerPage);

    const {execute: executeDelete} = useAction(deleteVideo, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Video deleted successfully');
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to delete video');
        },
    });

    const handleDelete = (videoId: number) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            executeDelete({courseId: Number(courseId), lessonId: Number(lessonId), videoId});
        }
    };

    return (
        <Wrapper>
            <Table className='table-admin'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>YouTube Link</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((video, index) => {
                        if (index < (page - 1) * videosPerPage || index >= page * videosPerPage) return null;
                        const updatedAtLocaleString = video.updatedAt ? new Date(video.updatedAt).toLocaleString() : ''

                        return (
                            <TableRow key={video.videoId}>
                                <TableCell>{video.title}</TableCell>
                                <TableCell>{video.description}</TableCell>
                                <TableCell>{video.durationInSec}</TableCell>
                                <TableCell> <a href={`https://www.youtube.com/watch?v=${video.youtubeLink}`}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               style={{color: 'blue', fontStyle: 'italic'}}>
                                    Watch Video
                                </a></TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {new Date(video.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className='whitespace-nowrap text-nowrap'>
                                    {updatedAtLocaleString}
                                </TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Ellipsis size={20}/>
                                        </PopoverTrigger>
                                        <PopoverContent align='end' className='w-40 border-navy border p-1'>
                                            <div className='flex flex-col text-sm *:text-left *:font-medium'>
                                                <h3 className='font-bold text-sm p-2'>Action</h3>
                                                <Link
                                                    href={`/portal/admin/courses/${courseId}/lessons/${lessonId}/videos/edit/${video.videoId}`}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(video.videoId)}
                                                    className='hover:bg-navy/40 p-2 rounded-md transition text-left'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination page={page} setPage={setPage} totalPage={totalPage}/>
        </Wrapper>
    );
} 