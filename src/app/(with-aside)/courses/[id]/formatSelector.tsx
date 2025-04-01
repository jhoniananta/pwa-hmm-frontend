'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FormatSelector({ format }: { format: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFormatChange = (newFormat: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('format', newFormat);
      const lessonId = params.get('lessonId');
      const expanded = params.get('expanded');
      
      router.replace(`?${params.toString()}`, {
        scroll: false
      });
    });
  };

  return (
    <div className="w-32 absolute top-[72px] md:top-20 right-4 md:right-8">
      <Select 
        value={format}
        onValueChange={handleFormatChange}
        disabled={isPending}
      >
        <SelectTrigger className="rounded-full border-navy">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="link">Link</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 