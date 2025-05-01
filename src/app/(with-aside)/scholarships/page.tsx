import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Bitcoin, ChevronRight, DollarSign} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {getScholarships} from '@/_actions/scholarship-action';
import BeasiswaInternalBanner from './beasiswa-internal-banner';

export const dynamic = 'force-dynamic';

const Scholarships = async () => {
    const data = await getScholarships();
    const pageId = 'scholarships';

    // ToDo: extract funding and scope from tags

    return (
        <>
            <BeasiswaInternalBanner/>
            <h2 className='md:text-lg text-base font-semibold'>
                Other Scholarship
            </h2>
            <ul className='w-full py-2 rounded-2xl shadow-md bg-white'>
                <Separator/>
                {data.map((scholarship) => {
                    return {...scholarship, funding: 'FULLY FUNDED', scope: 'Semester 1, 2, 3'}
                }).map(({title, provider, deadline, scholarshipId, funding, scope}, i) => (
                    <>
                        <Link
                            href={`/scholarships/${scholarshipId}`}
                            key={`${title}-${i}-${pageId}`}
                            className='flex gap-4 md:gap-8 hover:bg-gray-300 transition-all items-center py-1 md:pr-6 pr-4'
                        >
                            <Image
                                unoptimized={true}
                                src='/assets/beasiswa.jpg' // Default scholarship image
                                alt={title}
                                width={100}
                                height={100}
                                className='h-full max-h-24 md:max-h-28 max-w-32 w-64 md:max-w-40 object-cover'
                            />
                            <div className='flex w-full md:items-center flex-col md:flex-row py-4'>
                                <div className='md:w-1/2 md:space-y-2'>
                                    <h3
                                        className='md:text-lg text-base font-semibold line-clamp-1'
                                        title={title}
                                    >
                                        {title}
                                    </h3>
                                    <div>
                                        <p className='text-xs text-gray-600'>{provider}</p>
                                        <p className='text-xs text-red-600'>{`until - ${new Date(deadline).toDateString()}`}</p>
                                    </div>
                                </div>
                                <div className='flex md:w-1/2 items-center gap-1.5'>
                                    <div className='md:w-1/2'>
                                        <Badge
                                            variant={funding === 'FULLY_FUNDED' ? 'success' : 'alert'}
                                            className='h-min flex items-center w-fit text-3xs md:text-xs py-px px-1 md:py-0.5 md:px-2.5'
                                        >
                                            {funding === 'FULLY_FUNDED' ? (
                                                <Bitcoin className='w-4 md:block hidden'/>
                                            ) : (
                                                <DollarSign className='w-4 md:block hidden'/>
                                            )}
                                            {funding === 'FULLY_FUNDED' ? 'Fully Funded' : 'Partially Funded'}
                                        </Badge>
                                    </div>
                                    <div className='md:hidden w-px h-4 bg-border'></div>
                                    <div
                                        className='text-muted-foreground capitalize md:w-1/2 flex items-center gap-2 text-2xs md:text-sm line-clamp-2'>
                                        {scope}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className='w-4 h-4 md:w-6 md:h-6 hidden md:block'/>
                        </Link>
                        <Separator key={`${title}-${scholarshipId}`}/>
                    </>
                ))}
            </ul>
        </>
    );
};

export const metadata = {
    title: 'Scholarships',
};

export default Scholarships;
