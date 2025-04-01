import Image from 'next/image';
export default function VisiMisiSection() {
  return (
    <section className="rounded-none w-full h-auto mx-10">
      <div className="flex gap-8 md:gap-6 flex-col-reverse md:flex-row justify-center">
        <div className="w-1/2 max-w-[720px] max-md:w-full bg-blue-950 relative text-white max-md:rounded-2xl md:rounded-3xl">
          <Image
            src="/images/informasi-beasiswa/bg-right.png"
            width={658}
            height={504}
            alt="background"
            className="object-cover md:object-fill absolute inset-0 size-full z-0 overflow-hidden opacity-20 max-md:rounded-2xl md:rounded-3xl"
          />
          <article className="relative px-10 py-12">
            <h2 className="text-4xl font-bold text-white">Visi Kami</h2>
            <p className="mt-3 text-xl font-medium max-md:max-w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum eget risus vel mauris pretium viverra. Praesent non
              ipsum in nunc ornare suscipit.
            </p>

            <h2 className="relative mt-16 text-4xl font-bold max-md:mt-10 text-white">
              Misi Kami
            </h2>
            <ul className="mt-3 text-xl font-medium max-md:max-w-full list-disc pl-6 space-y-2">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Vestibulum eget risus vel mauris pretium viverra.</li>
              <li>Praesent non ipsum in nunc ornare suscipit.</li>
            </ul>
          </article>
        </div>
        <div className="min-h-[235px] md:w-1/2 md:h-auto max-w-[720px] max-h-[550px] max-md:rounded-2xl md:rounded-3xl relative">
          <Image
            src="/images/informasi-beasiswa/bg-visi-misi.png"
            width={720}
            height={550}
            alt="background"
            className="object-cover absolute inset-0 size-full max-md:rounded-2xl md:rounded-3xl z-0 overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}
