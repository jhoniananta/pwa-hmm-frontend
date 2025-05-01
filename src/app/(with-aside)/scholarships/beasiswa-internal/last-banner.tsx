import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function LastBanner() {
    return (
        <>
            <section className="flex mx-auto my-0 w-full h-full max-w-[1480px] max-md:flex-col max-md:h-auto">
                <div
                    className="flex relative flex-col gap-4 items-center justify-center h-auto max-md:rounded-t-2xl md:rounded-l-3xl bg-blue-950 max-w-[500px] max-md:w-full max-md:h-auto max-sm:p-5 w-1/2 min-h-[400px]">
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/bg-handshake.png"
                        width={500}
                        height={539}
                        alt="background"
                        className="object-cover absolute inset-0 size-full max-md:rounded-t-2xl md:rounded-l-3xl z-0 overflow-hidden"
                    />
                    <div className="overflow-hidden absolute top-0 left-0 pointer-events-none size-full"/>
                </div>

                <div
                    className="relative w-1/2 flex-1 p-10 bg-indigo-700 md:rounded-r-3xl max-md:p-8 max-md:w-full max-md:h-auto max-sm:p-5 max-md:rounded-b-2xl">
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/bg-right.png"
                        width={985}
                        height={440}
                        alt="background"
                        className="object-cover absolute inset-0 size-full rounded-[20px] z-0"
                    />

                    <div className="relative z-20">
                        <h2 className="mb-8 text-4xl font-bold text-center text-white max-md:text-3xl max-sm:mb-5 max-sm:text-3xl">
                            Mari Mendaftar Beasiswa HMM
                        </h2>
                        <p className="text-xl leading-normal text-white max-w-[970px] max-md:text-lg max-sm:text-base">
                            Jadilah bagian dari agen perubahan yang akan membawa HMM ITB dan
                            dunia keteknikmesinan di Indonesia menuju masa yang lebih baik dan
                            cerah. Lorem Ipsum dolor sit amet Lorem Lorem Ipsum Dolor Sit Amet
                            Sit Amatikum
                        </p>
                        <div className="flex flex-col gap-4 justify-between md:flex-row md:gap-0 mt-6 md:mt-8">
                            <Button
                                className="px-12 text-center whitespace-nowrap rounded-[30px] max-md:px-5 text-white bg-blue-950"
                            >
                                <Link href="/scholarships/step-registrasi">Alur Pendaftaran</Link>
                            </Button>
                            <Button
                                className="px-12 text-center whitespace-nowrap rounded-[30px] max-md:px-5 text-white bg-blue-950"
                            >
                                <Link href="/scholarships/registration">Daftar Sekarang</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-hidden absolute top-0 left-0 pointer-events-none size-full"/>
                </div>
            </section>
        </>
    );
}
