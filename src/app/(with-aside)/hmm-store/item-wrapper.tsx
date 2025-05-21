// @ts-nocheck
'use client';

import Item from './item';
import {type HTMLAttributes, useEffect, useId, useState} from 'react';
import {cn} from '@/lib/utils';
import Image from 'next/image';
import {AnimatePresence, motion} from 'framer-motion';
import MotionFramer from '@/components/client/modal-framer';
import MotionOverlay from '@/components/client/modal-overlay';
import {getPublicUrl} from "@/_actions/utils/utils";

const Main = ({className, ...props}: {} & HTMLAttributes<HTMLDivElement>) => {
    const [active, setActive] = useState<(typeof data)[number] | boolean | null>(
        null
    );
    const [size, setSize] = useState<string | null>('M');
    const id = useId();

    useEffect(() => {
        function onKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape') setActive(null);
        }

        if (active && typeof active === 'object') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [active]);

    return (
        <div
            className={cn(
                'flex-1 h-full flex flex-col gap-5 md:mt-5 mt-4',
                className
            )}
            {...props}
        >
            <MotionOverlay
                show={!!(active && typeof active === 'object')}
                setActive={setActive}
                setTo={null}
            />
            <AnimatePresence>
                {active && typeof active === 'object' && (
                    <MotionFramer
                        id={`item-${active.title + active.price + active.stars}-${id}`}
                        className='p-0.5 rounded-xl'
                    >
                        <motion.div
                            layoutId={`image-${
                                active.title + active.price + active.stars
                            }-${id}`}
                        >
                            <Image
                                unoptimized={true}
                                src={active.src ?? `/assets/images/store.png`}
                                alt='item'
                                width={1000}
                                height={1000}
                                className='w-full max-h-96 rounded-t-xl object-cover'
                            />
                        </motion.div>
                        <div className='flex p-4'>
                            <div className='w-1/2'>
                                <motion.h5
                                    layoutId={`title-${
                                        active.title + active.price + active.stars
                                    }-${id}`}
                                    className='font-bold'
                                >
                                    {active.title}
                                </motion.h5>
                                <h6 className='font-semibold'>T-shirt</h6>
                                <div className='flex mt-6'>
                                    <motion.div
                                        layoutId={`price-${
                                            active.title + active.price + active.stars
                                        }-${id}`}
                                        className='w-1/2'
                                    >
                                        <p className='text-abu-3 text-3xs'>Price (IDR)</p>
                                        <h6>{active.price}</h6>
                                    </motion.div>
                                    <motion.div
                                        layoutId={`rating-${
                                            active.title + active.price + active.stars
                                        }-${id}`}
                                        className='w-1/2'
                                    >
                                        <p className='text-abu-3 text-3xs'>Rating</p>
                                        <h6>
                                            <span className='text-kuning'>&#9733;</span>
                                            {active.stars}
                                        </h6>
                                    </motion.div>
                                </div>
                            </div>
                            <div className='w-1/2 h-full flex flex-col justify-between gap-4'>
                                <div className=''>
                                    <p className='text-abu-3 text-3xs'>Size</p>
                                    <div className='flex gap-4 mt-2'>
                                        {['S', 'M', 'L', 'XL'].map((s, i) => (
                                            <button
                                                key={i}
                                                className={cn(
                                                    'rounded text-2xs px-2 py-1 hover:bg-yellow-200',
                                                    size === s && 'bg-yellow-400 hover:bg-yellow-400'
                                                )}
                                                onClick={() => setSize(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button className='px-4 py-1 text-xs font-semibold bg-navy text-white rounded-full'>
                                    Order
                                </button>
                            </div>
                        </div>
                    </MotionFramer>
                )}
            </AnimatePresence>
            <div
                className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 lg:gap-x-10 md:gap-y-10 flex-1 grid-rows-2 mt-1'>
                {data.map((data, i) => (
                    <Item
                        data={data}
                        index={i + 1}
                        itemId={i}
                        key={i + data.title}
                        setActive={setActive}
                        id={id}
                    />
                ))}
            </div>
        </div>
    );
};

export const data = [
    {
        price: 100000,
        stars: 3.5,
        title: 'Kaos HMM Yellboys',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 89000,
        stars: 4.5,
        title: 'Kemeja Lapangan',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 120000,
        stars: 4,
        title: 'Jaket Himpunan',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 100000,
        stars: 3.5,
        title: 'Goodie Bag HMM',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 89000,
        stars: 4.5,
        title: 'Hoodie HMM',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 125000,
        stars: 4.2,
        title: 'Kaos HMM Mechanical',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 99000,
        stars: 3.9,
        title: 'Gantungan Kunci',
        src: getPublicUrl('/assets/images/store.png'),
    },
    {
        price: 89000,
        stars: 4.5,
        title: 'Topi Pramuka',
        src: getPublicUrl('/assets/images/store.png'),
    },
];

export default Main;
