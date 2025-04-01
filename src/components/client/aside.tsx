import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';
import Image from 'next/image';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import BurgerX from './burger-x';
import NavLinks from './nav-links';
import PathTitle from './path-title';
import { verifySession } from '@/lib/session';

type SidebarProps = HTMLAttributes<HTMLDivElement>;

async function Sidebar({ className, children, ...props }: SidebarProps) {
  const session = await verifySession();
  const isAdmin = session?.role === 'ADMIN';
  console.log(isAdmin);
  return (
    <aside
      className={cn(
        'min-w-56 bg-navy md:pl-6 lg:pl-10 py-12 sticky top-0 h-screen hidden md:block',
        className
      )}
      {...props}
    >
      <div className='flex mb-6 items-center gap-3'>
        <Image
          src='/images/logo.png'
          width={40}
          height={40}
          alt='logo'
        />
        <h1 className='text-white text-2xl font-bold text-nowrap'>HMM ITB</h1>
      </div>
      <NavLinks isAdmin={isAdmin} />
    </aside>
  );
}

async function AsideDrawer({ children }: SidebarProps) {
  const session = await verifySession();
  const isAdmin = session?.role === 'ADMIN';

  return (
    <aside className='md:hidden w-full flex justify-between items-center h-16 px-[max(1.5rem,2vw)] border-b'>
      <div className='flex gap-4 items-center min-w-[50%]'>
        <Drawer>
          <DrawerTrigger className='group/drawer'>
            <BurgerX />
          </DrawerTrigger>
          <DrawerContent className='bg-navy'>
            <div className='text-abu-2 text-sm font-medium bg-navy px-4'>
              <DrawerHeader>
                <DrawerTitle className='text-abu-2'>Menu</DrawerTitle>
              </DrawerHeader>
              <NavLinks isAdmin={isAdmin} className='pb-4' />
            </div>
          </DrawerContent>
        </Drawer>
        <h1 className='text-xl font-bold capitalize'>
          <PathTitle />
        </h1>
      </div>
      {children}
    </aside>
  );
}

export { Sidebar, AsideDrawer as Drawer };
