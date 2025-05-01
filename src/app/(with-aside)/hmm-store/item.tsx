import {cn} from '@/lib/utils';
import Image from 'next/image';
import type {Dispatch, SetStateAction} from 'react';
import {motion} from 'framer-motion';

const Item = ({
                  index,
                  itemId,
                  data,
                  setActive,
                  id,
              }: {
    index: number;
    itemId: number;
    data: {
        title: string;
        stars: number;
        price: number;
        src: string;
    };
    setActive: Dispatch<SetStateAction<typeof data | boolean | null>>;
    id: string;
}) => {
    const new_price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const COLORS = ['bg-kuning', 'bg-hijau', 'bg-oren', 'bg-blue-500'];
    const unique = `${data.title + data.price + data.stars}-${id}`;

    return (
        <motion.div
            className='rounded-xl shadow-md flex flex-col justify-end overflow-hidden cursor-pointer'
            onClick={() => {
                setActive(data);
            }}
            layoutId={`item-${unique}`}
        >
            <motion.div
                layoutId={`image-${unique}`}
            >
                <Image
                    unoptimized={true}
                    src={data.src ?? `/assets/images/store.png`}
                    alt='item'
                    width={300}
                    height={300}
                    className='object-cover h-full'
                />
            </motion.div>
            <div className='bg-white py-2 px-7 relative overflow-hidden flex flex-col gap-2 justify-between h-1/2'>
                <div
                    className={cn(
                        'absolute left-0 top-0 h-full w-4',
                        COLORS[Math.floor(Math.random() * 4)]
                    )}
                ></div>
                <motion.h5 layoutId={`title-` + unique}
                           className='font-semibold h-full flex items-center'>{data.title}</motion.h5>
                <div className='flex'>
                    <motion.div layoutId={'price-' + unique} className='w-1/2'>
                        <p className='text-abu-3 text-3xs'>Price (IDR)</p>
                        <h6>{new_price}</h6>
                    </motion.div>
                    <motion.div layoutId={'rating-' + unique} className='w-1/2'>
                        <p className='text-abu-3 text-3xs'>Rating</p>
                        <h6>
                            <span className='text-kuning'>&#9733;</span>
                            {data.stars}
                        </h6>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Item;
