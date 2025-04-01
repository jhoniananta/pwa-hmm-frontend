'use client';

import { usePathname } from 'next/navigation';
import { sideBarTabs, sideBarIcons } from '@/data/data';
import Link from 'next/link';
import { cn, pathFormatter } from '@/lib/utils';
import { type ReactNode } from 'react';
import { type LinkProps } from 'next/link';
import { ShieldAlert } from 'lucide-react';

function CusLink({
  href,
  className,
  children,
  isActive = false,
  icon,
  isDev = false,
}: {
  className?: string;
  isActive?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  isDev?: boolean;
} & LinkProps) {
  return (
    <Link
      className={cn(
        'relative py-2.5 pl-2 md:pl-4 pr-4 md:rounded-l-full rounded-md md:rounded-r-none flex md:gap-4 gap-3 items-center transition-all duration-150 ease-in-out before:absolute before:bottom-0 before:left-4 before:h-0.5 before:rounded-full before:w-0 before:transition-all before:bg-background before:translate-y-full',
        isActive
          ? 'md:bg-background md:text-navy text-white bg-blue-200/40 pl-4 md:pl-6'
          : 'md:hover:pl-6 md:hover:before:w-3/4 md:hover:pr-2',
        className
      )}
      href={href}
    >
      {icon}
      <h5 className='text-inherit'>
        {children}
        {isDev && <sup className="text-[0.6em] text-abu-3 ml-1">dev</sup>}
      </h5>
      {isActive && (
        <>
          <div className='hidden md:block aspect-square h-2 absolute right-0 top-0 -translate-y-full bg-background'>
            <div className='absolute right-0 top-0 bg-navy rounded-br-full h-full w-full'></div>
          </div>
          <div className='hidden md:block aspect-square h-2 absolute right-0 bottom-0 translate-y-full bg-background'>
            <div className='absolute right-0 top-0 bg-navy rounded-tr-full h-full w-full'></div>
          </div>
        </>
      )}
    </Link>
  );
}

export default function NavLinks({ className, isAdmin = false }: { className?: string; isAdmin?: boolean }) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1];

  // Define which tabs are in development
  const devTabs = ['MyHMM', 'MyCareer', 'HMM Store'];

  return (
    <div className={cn('flex flex-col gap-3 text-abu-2 text-sm font-medium', className)}>
      {sideBarTabs.map((tab, index) => {
        const href = '/' + pathFormatter(tab);
        const isDev = devTabs.includes(tab);

        return (
          <CusLink
            key={index}
            href={href}
            isActive={firstPath.toLowerCase() === pathFormatter(tab)}
            icon={sideBarIcons[index]}
            isDev={isDev}
          >
            {tab}
          </CusLink>
        );
      })}
      {isAdmin && (
        <CusLink href='/portal/admin' icon={<ShieldAlert size={16} />} className='text-red-500'>
          Admin
        </CusLink>
      )}
    </div>
  );
} 