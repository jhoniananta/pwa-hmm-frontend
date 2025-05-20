import Image from 'next/image';
import {useState} from 'react';

type ImageWithFallbackProps = {
    src?: string;
    fallbackSrc: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
};

export const ImageWithFallback = ({
                                      src,
                                      fallbackSrc,
                                      alt,
                                      width,
                                      height,
                                      className,
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
            width={width}
            height={height}
            className={className}
            onError={handleError}
        />
    );
};