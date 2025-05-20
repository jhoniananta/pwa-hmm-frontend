import Image from 'next/image';
import {useState} from 'react';

type ImageWithFallbackProps = {
    src?: string;
    fallbackSrc: string;
    alt: string;
    width?: number;
    fill?: boolean;
    height?: number;
    className?: string;
    sizes?: string;
};

export const ImageWithFallback = ({
                                      src,
                                      fallbackSrc,
                                      alt,
                                      width,
                                      height,
                                      className,
                                      sizes,
                                      fill,
                                  }: ImageWithFallbackProps) => {
    const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

    const handleError = () => {
        if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
    };

    return (
        <Image
            src={imageSrc}
            unoptimized={true}
            alt={alt}
            fill={fill}
            sizes={sizes}
            width={width}
            height={height}
            className={className}
            onError={handleError}
        />
    );
};

