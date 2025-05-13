import ClientBreadcrumb from '@/components/client/breadcrumb';
import HeaderNav from '@/components/client/header';
import Navbar from '@/components/client/navbar';
import ProfileMenu from '@/components/client/profileMenu';
import { ReactNode, Suspense } from 'react';
import MainTransition from './transition';

export default function Template({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Navbar>
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileMenu />
        </Suspense>
      </Navbar>
      <MainTransition>
        <HeaderNav />
        <ClientBreadcrumb />
        {children}
      </MainTransition>
    </>
  );
}
