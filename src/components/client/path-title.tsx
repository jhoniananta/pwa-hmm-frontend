'use client';

import { usePathname } from 'next/navigation';

export default function PathTitle() {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1];
  
  return firstPath === 'mycareer' 
    ? 'MyCareer' 
    : firstPath.replace('hmm', 'HMM');
} 