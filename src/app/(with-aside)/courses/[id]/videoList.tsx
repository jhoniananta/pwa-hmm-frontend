import {Separator} from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoList({
                                      materials,
                                      isExpanded,
                                      query,
                                      lessonId,
                                  }: {
    materials: { videoId: string; youtubeLink: string; title: string; thumbnail_url: string }[];
    isExpanded?: boolean;
    query: string;
    lessonId: string;
}) {
    return (
        <div className='w-full'>
            <Separator/>
            {materials.map(({videoId, youtubeLink, title, thumbnail_url}, index) => {
                if (!isExpanded && index > 5) return null;
                return (
                    <>
                        <Link
                            key={videoId}
                            href={`?q=${youtubeLink}&expanded=${isExpanded}&lessonId=${lessonId}`}
                            className='px-2 py-2.5 flex gap-4 items-center text-sm'
                        >
                            <Image
                                src={thumbnail_url}
                                alt={title}
                                width={160}
                                height={120}
                                className='aspect-[4/3] rounded-md max-h-[calc(80*3/4px)] max-w-20'
                            />
                            <div className=''>{title}</div>
                        </Link>
                        <Separator key={videoId}/>
                    </>
                );
            })}
            {materials.length > 6 && (
                <div className='relative bg-gray-400 h-px w-full rounded-full md:hidden'>
                    <Link
                        href={`?q=${query}&expanded=${
                            isExpanded ? 'false' : 'true'
                        }&lessonId=${lessonId}`}
                        className='bg-white text-2xs absolute left-1/2 top-1/2 px-0.5 py-px rounded-sm -translate-x-1/2 -translate-y-1/2'
                        scroll={false}
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </Link>
                </div>
            )}
        </div>
    );
}
