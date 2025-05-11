import Link from 'next/link';
import Poster from './poster';
import {Link as LinkIcon} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {getScholarshipById} from "@/_actions/scholarship-action";

const dummyData = [
    {
        id: 1,
        title: 'Beasiswa Tanoto Foundation',
        provider: 'Tanoto Foundation',
        deadline: new Date('2024-12-31'),
        reference: 'https://www.tanotofoundation.org/en/education/scholarship/',
        funding: 'FULLY_FUNDED',
        scope: 'Undergraduate',
        description: 'Beasiswa untuk mahasiswa berprestasi dari Tanoto Foundation',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        title: 'Beasiswa LPDP',
        provider: 'LPDP',
        deadline: new Date('2024-11-30'),
        reference: 'https://www.lpdp.kemenkeu.go.id/',
        funding: 'FULLY_FUNDED',
        scope: 'Graduate',
        description: 'Program beasiswa dari Kementerian Keuangan RI',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        title: 'Djarum Beasiswa Plus',
        provider: 'PT Djarum',
        deadline: new Date('2024-10-15'),
        reference: 'https://djarumbeasiswaplus.org/',
        funding: 'PARTIALLY_FUNDED',
        scope: 'Undergraduate',
        description: 'Program beasiswa dari Djarum Foundation',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        title: 'Beasiswa Bank Indonesia',
        provider: 'Bank Indonesia',
        deadline: new Date('2024-09-30'),
        reference: 'https://www.bi.go.id/',
        funding: 'PARTIALLY_FUNDED',
        scope: 'Undergraduate',
        description: 'Program beasiswa dari Bank Indonesia',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 5,
        title: 'Beasiswa BCA',
        provider: 'Bank Central Asia',
        deadline: new Date('2024-08-31'),
        reference: 'https://www.bca.co.id/',
        funding: 'FULLY_FUNDED',
        scope: 'Undergraduate',
        description: 'Program beasiswa dari BCA untuk mahasiswa berprestasi',
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

export default async function Scholarship({params}: { params: { id: string } }) {
    const scholarship = await getScholarshipById(Number(params.id))

    return (
        <div className='bg-white rounded-xl p-2 md:p-6 md:py-8 flex gap-12 items-center'>
            <div className='hidden md:block'>
                <Poster
                    src='/assets/beasiswa.jpg'
                    alt={scholarship.title}
                    mode='desktop'
                    className='w-full max-w-96'
                />
            </div>
            <div className='space-y-4 md:space-y-8 flex-1 md:py-2'>
                <div className='flex gap-6 items-center'>
                    <Poster
                        src='/assets/beasiswa.jpg'
                        alt={scholarship.title}
                        mode='mobile'
                    />
                    <div className='space-y-3'>
                        <h3 className='font-semibold md:text-2xl'>{scholarship.title}</h3>
                        <div>
                            <p className='text-xs text-gray-600'>{scholarship.provider}</p>
                            <p className='text-xs text-red-600'>{`until - ${new Date(scholarship.deadline).toDateString()}`}</p>
                            {/*<div className='flex items-center gap-1.5 mt-1'>*/}
                            <div className="space-y-2 mt-1">
                                {/*<div*/}
                                {/*    className='text-muted-foreground capitalize md:w-1/2 flex items-center gap-2 text-2xs md:text-sm'>*/}
                                {/*    <Users className='md:w-4 w-2.5'/>{' '}*/}
                                {/*    {scholarship.scope}*/}
                                {/*</div>*/}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    {
                                        scholarship.tags.map((tag, i) => {
                                            const colors = [
                                                "border-transparent bg-merah text-primary-foreground hover:bg-merah/80",
                                                "border-transparent bg-navy text-primary-foreground hover:bg-navy/80",
                                                "border-transparent bg-hijau text-primary-foreground hover:bg-hijau/80",
                                                "border-transparent bg-kuning text-destructive-foreground hover:bg-kuning/80",
                                                "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                            ]

                                            return (<Badge key={i}
                                                           className={'h-min flex items-center w-max text-3xs text-nowrap md:text-xs py-px px-1 md:py-0.5 md:px-2.5' + colors[i % colors.length]}
                                            >
                                                {tag.title}
                                            </Badge>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <Link
                            href={scholarship.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-xs flex items-center gap-2 hover:underline transition-all'
                        >
                            <LinkIcon className='w-3 h-3'/> <span>Link Pendaftaran</span>
                        </Link>
                    </div>
                </div>
                <div className='space-y-2'>
                    <h3 className='text-base'>Description</h3>
                    <p className='border border-navy rounded-xl p-4 text-black min-h-[50dvh] md:min-h-[30vh]'>
                        {scholarship.description || 'No description available'}
                    </p>
                </div>
            </div>
        </div>
    );
}
