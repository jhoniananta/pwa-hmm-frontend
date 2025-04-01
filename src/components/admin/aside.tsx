import { cn } from '@/lib/utils';
import * as NextLink from 'next/link';
import type { HTMLAttributes } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer as ShadDrawer,
} from '@/components/ui/drawer';
import { EllipsisVertical } from 'lucide-react';

const links = [
  { title: 'Assignments', path: 'assignments' },
  { title: 'Courses', path: 'courses' },
  { title: 'HMM-Store', path: 'hmm-store' },
  { title: 'MyHMM', path: "myhmm" },
  { title: 'MyCareer', path: 'mycareer' },
  { title: 'Users', path: 'users' },
  { title: 'Events', path: 'events' },
  { title: 'Scholarships', path: 'scholarships' },
  { title: 'Sign Out', path: 'sign-out' },
];

function Link({
  href,
  className,
  children,
  isActive,
  ...props
}: { isActive: boolean } & HTMLAttributes<HTMLAnchorElement> &
  NextLink.LinkProps) {
  return (
    <NextLink.default
      href={href === 'sign-out' ? '/sign-out' : `/portal/admin/${href}`}
      className={cn(
        'px-4 py-2 rounded-lg border border-abu-2 w-full font-semibold text-abu-2 transition-colors',
        isActive ? 'bg-background text-navy' : 'hover:bg-abu-2 hover:text-navy',
        className
      )}
      {...props}
    >
      {children}
    </NextLink.default>
  );
}

function Sidebar({
  className,
  loc,
  ...props
}: { loc: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <aside
      className={cn(
        'w-60 bg-navy px-5 py-12 sticky top-0 h-dvh hidden md:flex flex-col gap-5',
        className
      )}
      role='navigation'
      {...props}
    >
      <h1 className='text-white text-2xl font-bold uppercase'>Admin Page</h1>
      <NextLink.default href='/dashboard' className={cn(
        'px-4 py-2 rounded-lg border border-abu-2 w-full font-semibold text-abu-2 transition-colors',
        loc === '/' ? 'bg-background text-navy' : 'hover:bg-abu-2 hover:text-navy',
        className
      )}>Home</NextLink.default>
      {links.map(({ title, path }) => (
        <Link
          key={title + path}
          href={path}
          isActive={loc === path}
        >
          {title}
        </Link>
      ))}
    </aside>
  );
}

function Drawer({
  className,
  loc,
  ...props
}: { loc: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <aside
      className={cn(
        'md:hidden flex items-center justify-between px-6 py-5',
        className
      )}
      role='navigation'
      {...props}
    >
      <h2 className=''>{links.find(({ path }) => loc === path)?.title}</h2>
      <ShadDrawer>
        <DrawerTrigger>
          <EllipsisVertical size={24} />
        </DrawerTrigger>
        <DrawerContent className='bg-navy'>
          <div className='text-abu-2 text-sm font-medium bg-navy px-4'>
            <DrawerHeader>
              <DrawerTitle className='text-abu-2'>Admin Page</DrawerTitle>
            </DrawerHeader>
            <div className='flex flex-col gap-3 pb-4'>
              <NextLink.default href='/dashboard' className={cn(
                'px-4 py-2 rounded-lg border border-abu-2 w-full font-semibold text-abu-2 transition-colors',
                loc === '/' ? 'bg-background text-navy' : 'hover:bg-abu-2 hover:text-navy',
                className
              )}>Home</NextLink.default>
              {links.map(({ title, path }, index) => (
                <Link
                  key={index}
                  href={path}
                  isActive={loc === path}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </DrawerContent>
      </ShadDrawer>
    </aside>
  );
}

export { Sidebar, Drawer };
