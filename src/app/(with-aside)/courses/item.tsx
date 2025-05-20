import {cn} from '@/lib/utils';
import Link, {type LinkProps} from 'next/link';
import {FileSpreadsheet, SquarePlay} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {getRandomValue} from "@/utils/utils";
import {ImageWithFallback} from "@/components/ui/image-with-fallback";
import {getPublicUrl} from "@/_actions/utils/utils";

type CoursesItemProps = {
    id: string | number;
    title: string;
    image: string;
    subject: string;
    numberOfMaterials: number;
    numberOfVideos: number;
    className?: string;
    isAllCourse: boolean;
    isWatch: boolean;
    isEnroll: boolean;
} & LinkProps;

const images = [
    '/assets/images/mesin.png',
    '/assets/images/pengukuran.png',
    '/assets/images/pipe_system.png',
    '/assets/images/printer.png',
];

export default function CoursesItem({
                                        id,
                                        title,
                                        image,
                                        subject,
                                        numberOfMaterials,
                                        numberOfVideos,
                                        className,
                                        href = '',
                                        isAllCourse,
                                        isWatch,
                                        isEnroll
                                    }: CoursesItemProps) {

    const COLORS = ['bg-kuning', 'bg-hijau', 'bg-oren', 'bg-blue-500'];

    let query = '?'

    if (isWatch) {
        query += 'watch=true';
    } else if (isEnroll) {
        query += 'enroll=true';
    }

    return (
        <Link
            href={`/courses/${id}/${query}`}
            className={cn(
                'rounded-xl shadow-md flex flex-col justify-end overflow-hidden cursor-pointer aspect-[4/5] md:aspect-[9/10] lg:aspect-square',
                className
            )}
        >
            <ImageWithFallback
                src={getPublicUrl(image)}
                fallbackSrc={getPublicUrl(getRandomValue(images) as string)}
                alt='item'
                width={300}
                height={200}
                className='object-cover h-3/5'/>
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
