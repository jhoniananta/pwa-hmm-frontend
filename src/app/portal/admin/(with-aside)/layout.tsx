import type { Metadata } from 'next';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: {
    default: 'Admin HMM ITB',
    template: '%s | Admin HMM ITB',
    absolute: 'Admin HMM ITB',
  },
};
