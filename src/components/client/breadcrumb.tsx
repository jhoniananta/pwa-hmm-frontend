'use client';

import {usePathname} from 'next/navigation';
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,} from '../ui/breadcrumb';
import type {HTMLAttributes} from 'react';

const dict: { [key: string]: string } = {
    myhmm: 'MyHMM',
    mycareer: 'MyCareer',
};

const formatter = (path: string) => {
    let formatted = path.replace('-', ' ');

    return formatted.replace('hmm', 'HMM');
};

export default function ClientBreadcrumb({
                                             className,
                                             ...props
                                         }: HTMLAttributes<HTMLDivElement>) {
    const pathname = usePathname();
    const array = pathname.split('/').slice(1);

    if (array.length === 1) return null;

    return (
        <Breadcrumb
            className={className}
            {...props}
        >
            <BreadcrumbList>
                {array.map((path, index) => (
                    <>
                        <BreadcrumbItem key={path + index}>
                            <BreadcrumbLink
                                href={"/" + array.slice(0, index + 1)
                                    .join('/')}
                                className='capitalize'
                            >
                                {dict[path] || formatter(path)}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== array.length - 1 && (
                            <BreadcrumbSeparator key={path + index + "SC"}/>
                        )}
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
