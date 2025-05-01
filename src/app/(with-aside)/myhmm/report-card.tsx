import type {ReactNode} from "react";
import GradientText from "@/components/ui/gradient-text";
import Image from "next/image";

function ReportCard({title, children}: { title: string, children?: ReactNode }) {
    return (
        <div
            className='flex flex-col md:rounded-xl gap-4 md:gap-8 rounded-md bg-navy relative md:p-8 p-3 overflow-hidden'>
            <Image unoptimized={true} src={'/assets/hmm-vstock/bp-white-transparent.png'} alt={'logo'} width={300}
                   height={300}
                   className='z-0 opacity-10 bottom-0 shadow-none absolute w-[120%]'/>
            <GradientText className='h-2/5 md:text-2xl text-center text-2xs grid place-items-center'>
                {title}
            </GradientText>
            <div className='md:max-h-52 max-h-32 aspect-square w-full grid place-items-center z-10'>
                {children}
            </div>
        </div>
    );
}

export default ReportCard;