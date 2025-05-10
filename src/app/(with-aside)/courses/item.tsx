import {cn} from '@/lib/utils';
import Link, {type LinkProps} from 'next/link';
import Image from 'next/image';
import {FileSpreadsheet, SquarePlay} from 'lucide-react';
import {Separator} from '@/components/ui/separator';

type CoursesItemProps = {
    id: string | number;
    title: string;
    image: string;
    subject: string;
    numberOfMaterials: number;
    numberOfVideos: number;
    className?: string;
    isAllCourse: boolean
} & LinkProps;

export default function CoursesItem({
                                        id,
                                        title,
                                        image,
                                        subject,
                                        numberOfMaterials,
                                        numberOfVideos,
                                        className,
                                        href = '',
                                        isAllCourse
                                    }: CoursesItemProps) {
    const COLORS = ['bg-kuning', 'bg-hijau', 'bg-oren', 'bg-blue-500'];

    return (
        <Link
            href={`/courses/${id}` + (isAllCourse ? '/?enrollment_page=true' : '')}
            className={cn(
                'rounded-xl shadow-md flex flex-col justify-end overflow-hidden cursor-pointer aspect-[4/5] md:aspect-[9/10] lg:aspect-square',
                className
            )}
        >
            <Image
                unoptimized={true}
                src={image}
                alt='item'
                width={300}
                height={200}
                className='object-cover h-3/5'
            />
            <div
                className='bg-white py-2 md:pt-4 px-5 md:px-7 relative overflow-hidden flex flex-col justify-between h-2/5'>
                <div
                    className={cn(
                        'absolute left-0 top-0 h-full w-2.5 md:w-4',
                        COLORS[Math.floor(Math.random() * 4)]
                    )}
                ></div>
                <div className='space-y-2'>
                    <h6 className='text-muted-foreground text-2xs md:text-xs'>{subject}</h6>
                    <h4 className='text-xs md:text-sm font-medium text-ellipsis line-clamp-1' title={title}>{title}</h4>
                </div>
                <div className='space-y-1'>
                    <Separator/>
                    <div className='flex justify-end gap-2 items-center md:text-sm self-end text-xs'>
                        <FileSpreadsheet size={10}/>
                        <span>{numberOfMaterials}</span>
                        <SquarePlay size={10}/>
                        <span>{numberOfVideos}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
