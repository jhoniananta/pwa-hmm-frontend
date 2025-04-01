import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { LinkIcon, ExternalLinkIcon } from 'lucide-react';

export default function LinkList({
  materials,
  isExpanded,
  query,
  lessonId,
}: {
  materials: { title: string; url: string }[];
  isExpanded?: boolean;
  query: string;
  lessonId: string;
}) {
  return (
    <div className='w-full'>
      <p className='font-medium mb-2'>All Links</p>
      <Separator />
      {materials.map(({ title, url }, index) => {
        if (!isExpanded && index > 5) return null;
        return (
          <>
            <div className='flex justify-between items-center px-2 py-2.5'>
              <Link
                key={url}
                href={`?q=${url}&expanded=${isExpanded}&lessonId=${lessonId}&format=link`}
                className='flex gap-4 items-center text-sm flex-grow'
              >
                <div className='flex items-center gap-3'>
                  <LinkIcon className="w-5 h-5 text-navy" />
                  <span>{title}</span>
                </div>
              </Link>
              <Link 
                href={url} 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-navy hover:text-navy/80"
              >
                <ExternalLinkIcon className="w-5 h-5" />
              </Link>
            </div>
            <Separator key={`sep-${url}`} />
          </>
        );
      })}
    </div>
  );
} 