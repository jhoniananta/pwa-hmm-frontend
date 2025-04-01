import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export default function YoutubeEmbed({
  embedId,
  title,
  className,
  ...props
}: { embedId: string; title: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={'aspect-video sticky top-0'}
      {...props}
    >
      <iframe
        width='1000'
        height='1000'
        src={`https://www.youtube.com/embed/${embedId}`}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        className={cn('w-full h-full', className)}
      ></iframe>
    </div>
  );
}
