import {FaDonate} from 'react-icons/fa';
import Image from 'next/image';

export default function RelasiSection() {
    return (
        <div className='flex flex-col gap-8 md:gap-10'>
            <section className="flex mx-auto my-0 w-full h-full max-w-[1480px] max-md:flex-col max-md:h-auto">
                <div
                    className="flex relative flex-col gap-4 items-center justify-center p-10 h-auto max-md:rounded-t-2xl md:rounded-l-3xl bg-blue-950 w-[404px] max-md:p-8 max-md:w-full max-md:h-auto max-sm:p-5">
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/bg-sekapur-sirih.png"
                        width={348}
                        height={438}
                        alt="background"
                        className="object-cover absolute inset-0 size-full max-md:rounded-t-2xl md:rounded-l-3xl z-0 overflow-hidden"
                    />

                    <FaDonate className="h-[135px] w-[135px] max-sm:h-[100px] max-sm:w-[100px] text-white z-20"/>
                    <h2 className="text-4xl font-bold leading-tight text-center text-white max-md:mx-0 max-md:my-5 max-md:text-3xl max-sm:text-3xl z-20">
                        <span>Sekapur Sirih</span>
                        <br/>
                        <span>Beasiswa HMM</span>
                    </h2>
                    <div className="overflow-hidden absolute top-0 left-0 pointer-events-none size-full"/>
                </div>

                <div
                    className="relative flex-1 p-10 bg-indigo-700 md:rounded-r-3xl max-md:p-8 max-md:w-full max-md:h-auto max-sm:p-5 max-md:rounded-b-2xl">
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
                            Membangun Relasi, Mendukung Solusi
                        </h2>
                        <p className="text-xl leading-normal text-white max-w-[970px] max-md:text-lg max-sm:text-base">
                            <span>Kami meyakini bahwa</span>{' '}
                            <strong className="font-bold">
                                pendidikan merupakan fondasi penting bagi kemajuan bangsa
                            </strong>
                            <span>
                . Melalui pendidikan yang berkualitas, generasi muda memiliki
                kesempatan untuk mengembangkan potensi diri secara optimal dan
                berkontribusi pada pembangunan masyarakat. Namun,{' '}
              </span>
                            <strong className="font-bold">
                                tidak semua individu memiliki akses yang sama terhadap
                                pendidikan
                            </strong>
                            <span>.</span>
                            <br/>
                            <br/>
                            <span>Oleh karena itu,</span>{' '}
                            <strong className="font-bold">
                                program beasiswa ini hadir sebagai upaya untuk memberikan
                                kesempatan kepada putra-putri terbaik bangsa
                            </strong>{' '}
                            <span>
                untuk meraih pendidikan tinggi, tanpa perlu terkendala maupun
                terbebani oleh keterbatasan ekonomi.
              </span>
                        </p>
                    </div>
                    <div className="overflow-hidden absolute top-0 left-0 pointer-events-none size-full"/>
                </div>
            </section>
            <section
                className='flex items-center justify-center rounded-3xl max-w-[1480px] w-full mx-auto border-blue-950 border-4 shadow-xl'>
                <h1 className='2xl:text-[36px] text-[24px] font-bold text-center py-10 px-4'>
                    Lebih dari sekedar memberi, kami berjuang demi tujuan yang lebih besar
                </h1>
            </section>
        </div>
    );
}
