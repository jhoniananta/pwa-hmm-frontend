import {Separator} from '@/components/ui/separator';
import Link from 'next/link';
import {DownloadIcon, FileIcon} from 'lucide-react';
import {AttachmentResponse} from "@/_actions/attachments-action";

export default function PdfList({
                                    attachments,
                                    isExpanded,
                                    query,
                                    lessonId,
                                }: {
    attachments: AttachmentResponse[];
    isExpanded?: boolean;
    query: string;
    lessonId: string;
}) {
    return (
        <div className='w-full'>
            <p className='font-medium mb-2'>All Files</p>
            <Separator/>
            {attachments.map(({name, file}, index) => {
                if (!isExpanded && index > 5) return null;
                return (
                    <>
                        <div className='flex justify-between items-center px-2 py-2.5'>
                            <Link
                                key={file}
                                href={`?q=${file}&expanded=${isExpanded}&lessonId=${lessonId}&format=pdf`}
                                className='flex gap-4 items-center text-sm flex-grow'
                            >
                                <div className='flex items-center gap-3'>
                                    <FileIcon className="w-5 h-5 text-navy"/>
                                    <span>{name}</span>
                                </div>
                            </Link>
                            <Link
                                href={file}
                                download
                                className="text-navy hover:text-navy/80"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                            </Link>
                        </div>
                        <Separator key={`sep-${file}`}/>
                    </>
                );
            })}
        </div>
    );
} 