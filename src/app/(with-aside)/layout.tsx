import type { Metadata } from 'next';
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}

export const metadata: Metadata = {
  title: {
    default: 'HMM ITB',
    template: '%s | HMM ITB',
    absolute: 'HMM ITB',
  },
};

