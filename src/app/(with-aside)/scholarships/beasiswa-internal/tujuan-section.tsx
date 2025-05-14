import Image from 'next/image';

export default function TujuanBeasiswaSection() {
    return (
        <>
            <section
                className="flex flex-row mx-auto my-0 w-full h-full max-w-[1480px] max-md:flex-col max-md:h-auto gap-8 md:gap-6 relative">
                <div
                    className="min-h-[235px] md:w-1/2 md:h-auto max-w-[720px] max-h-[550px] max-md:rounded-2xl md:rounded-3xl relative">
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/toples-tujuan.png"
                        width={720}
                        height={550}
                        alt="background"
                        className="object-cover absolute inset-0 size-full max-md:rounded-2xl md:rounded-3xl"
                    />
                </div>
                <div
                    className="max-w-[720px] h-full md:max-h-[550px] max-md:rounded-2xl md:rounded-3xl relative bg-white md:w-1/2 py-12 px-8">
                    <h2 className="mb-8 text-4xl font-bold text-center text-blue-950 max-md:text-3xl max-sm:mb-5 max-sm:text-3xl">
                        Tujuan Beasiswa HMM
                    </h2>
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/tl-bg.png"
                        alt="top left icon"
                        width={120}
                        height={102}
                        className="absolute left-0 top-0 max-md:rounded-tl-2xl md:rounded-tl-3xl"
                    />
                    <p className="text-xl leading-normal text-blue-950 max-w-[970px] max-md:text-lg max-sm:text-base px-6 md:px-8 pb-6 md:pb-4 text-justify">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                        eget risus vel mauris pretium viverra. Praesent non ipsum in nunc
                        ornare suscipit.
                        <br/>
                        <br/>
                        Praesent ullamcorper nulla sit amet ex egestas commodo. Fusce at
                        vestibulum nunc. Nulla facilisi. Nullam at nisi et mi vulputate
                        aliquet a sed sem. Ut nulla erat, tempor ut finibus sed, porttitor
                        et turpis.
                    </p>
                    <Image
                        unoptimized={true}
                        src="/assets/images/informasi-beasiswa/br-bg.png"
                        alt="bottom right icon"
                        width={110}
                        height={102}
                        className="absolute right-0 bottom-0 max-md:rounded-br-2xl md:rounded-br-3xl"
                    />
                </div>
            </section>
        </>
    );
}
