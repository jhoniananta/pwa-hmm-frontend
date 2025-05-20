import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function BeasiswaInternalBanner() {
    return (
        <div
            className="flex relative flex-col max-sm:px-5 max-sm:py-6 px-14 py-16 min-w-full rounded-[20px] min-h-[552px] max-md:w-full max-md:origin-top shadow-lg">
            <Image
                unoptimized={true}
                src="/assets/images/bg-hmm-internal.png"
                alt="backgroud internal"
                className="object-cover absolute inset-0 size-full rounded-[20px]"
                width="1280"
                height="595"
            />
            <div className="flex relative flex-wrap gap-5 justify-between font-bold max-md:mr-1">
                <div className="text-8xl leading-[70px] text-zinc-900 max-md:text-4xl max-md:leading-9">
                    <div className="mt-8 flex flex-col items-start">
                        <h1 className="text-black text-[50px] lg:text-[96px] font-poltawski leading-tight">Beasiswa</h1>
                        <h1 className="text-black text-[50px] lg:text-[96px] font-poltawski leading-tight">HMM ITB</h1>
                    </div>
                </div>
                <div
                    className="max-[1025px]:w-full xl:w-[240px] self-end grid grid-rows-3 gap-4 mt-11 max-sm:text-lg text-2xl text-center text-blue-950 max-md:mt-10">
                    <Button
                        variant={'outline'}
                        className="px-12 text-center whitespace-nowrap border-4 border-solid border-blue-950 rounded-[91px] max-md:px-5"
                    >
                        <Link href="/scholarships/beasiswa-internal">Informasi</Link>
                    </Button>
                    <Button
                        variant={'outline'}
                        className="px-12 text-center border-4 border-solid border-blue-950 rounded-[91px] max-md:px-5"
                    >
                        <Link href={'/scholarships/step-registrasi'}>Cara Mendaftar</Link>
                    </Button>
                    <Button
                        variant={'outline'}
                        className="px-12 text-center whitespace-nowrap border-4 border-solid border-blue-950 rounded-[91px] max-md:px-5"
                    >
                        <Link href={'/scholarships/registration'} className="w-full">
                            Daftar
                        </Link>
                    </Button>
                </div>
            </div>
            <article className="relative mt-12 max-sm:text-md text-xl text-black">
                <p>
                    Beasiswa HMM ITB merupakan program yang diselenggarakan oleh HMM ITB
                    dengan tujuan memberikan bantuan finansial kepada seluruh anggota HMM
                    ITB untuk mendukung kelancaran studi perkuliahan. Seluruh rangkaian
                    proses, termasuk seleksi penerima, pengelolaan keuangan, serta
                    monitoring dan evaluasi program, sepenuhnya dikelola oleh HMM ITB.
                </p>
            </article>
        </div>
    );
}
