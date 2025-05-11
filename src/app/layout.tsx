import type {Metadata} from 'next';
import {Poltawski_Nowy, Poppins} from 'next/font/google';
import './globals.css';
import {cn} from '@/lib/utils';
import {TooltipProvider} from '@/components/ui/tooltip';
import {Toaster} from '@/components/ui/sonner';
import QueryProvider from '@/components/QueryClientProvider';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const poltawski = Poltawski_Nowy({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <meta name="application-name" content="HMM ITB"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="apple-mobile-web-app-title" content="HMM ITB"/>
            <meta name="format-detection" content="telephone=no"/>
            <meta name="mobile-web-app-capable" content="yes"/>
        </head>
        <body
            className={cn(
                poppins.className,
                'md:flex [--font-poppins:${poppins.style.fontFamily}] [--font-poltawski:${poltawski.style.fontFamily}]'
            )}
        >
        {/* Wrap children with QueryProvider */}
        <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors/>
        </QueryProvider>
        </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: {
        default: 'HMM ITB',
        absolute: 'HMM ITB',
    },
    description: 'Progressive Web Apps for HMM ITB',
    manifest: '/manifest.json?v=2',
    // themeColor: '#000080',
    // viewport: {
    //     width: 'device-width',
    //     initialScale: 1,
    //     maximumScale: 1,
    // },
    icons: {
        icon: [
            {url: '/assets/icons/icon-192x192.png', sizes: '192x192', type: 'image/png'},
            {url: '/assets/icons/icon-512x512.png', sizes: '512x512', type: 'image/png'},
            {url: '/assets/icons/mobile.png', sizes: '853x1280', type: 'image/png'},
        ],
        apple: [{url: '/assets/icons/icon-192x192.png'}],
    },
};