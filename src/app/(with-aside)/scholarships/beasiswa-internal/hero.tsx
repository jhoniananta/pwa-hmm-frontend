import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {getPublicUrl} from "@/_actions/utils/utils";

export default function HeroSection() {
    return (
        <section
            className='overflow-hidden relative mx-auto my-0 w-full rounded-3xl h-[575px] max-w-[1476px] max-md:mx-5 max-md:my-0 max-md:h-[500px] max-sm:mx-2.5 max-sm:my-0 max-sm:h-[400px] font-poppins shadow-lg'>
            <Image
                unoptimized={true}
                src={getPublicUrl('/assets/images/informasi-beasiswa/bg-kart.png')}
                width={1476}
                height={575}
                alt='Go kart racing background'
                className='object-cover absolute inset-0 size-full rounded-[20px] z-0'
            />
            <div className='absolute top-0 left-0 z-10 size-full bg-gradient-to-b from-transparent to-blue-950'/>
            <div
                className='box-border relative z-20 px-16 pb-8 w-full h-full max-sm:px-5 max-sm:py-8 flex flex-col max-md:justify-end max-md:items-center md:flex-row items-end gap-4'>
                <header className='mb-8'>
                    <h1 className='font-bold text-white font-poppins'>
            <span
                className='block mx-0 my-3 text-6xl 2xl:text-8xl leading-[70px] max-md:text-6xl max-md:leading-[50px] max-sm:text-4xl max-sm:leading-10 font-poltawski'>
              Beasiswa
            </span>
                        <span
                            className='block mx-0 my-3 text-6xl 2xl:text-8xl leading-[70px] max-md:text-6xl max-md:leading-[50px] max-sm:text-4xl max-sm:leading-10 font-poltawski'>
              HMM ITB
            </span>
                    </h1>
                </header>
                <div
                    className='flex md:gap-6 xl:gap-10 justify-end max-md:flex-col max-md:gap-5 items-center h-1/4 w-full'>
                    <Button
                        variant={'secondary'}
                        size={'lg'}
                        className='py-4 text-center whitespace-nowrap border-4 border-solid border-[#4541B9] rounded-[30px] max-md:px-5 2xl:h-[71px] 2xl:w-[352px]'
                    >
                        <Link href='/scholarships/step-registrasi' className='text-2xl'>
                            Alur Pendaftaran
                        </Link>
                    </Button>
                    <Button
                        variant={'secondary'}
                        size={'lg'}
                        className='py-4 text-center whitespace-nowrap border-4 border-solid border-[#4541B9] rounded-[30px] max-md:px-5 2xl:h-[71px] 2xl:w-[352px]'
                    >
                        <Link href='/scholarships/registration' className='text-2xl'>
                            Daftar Sekarang
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
