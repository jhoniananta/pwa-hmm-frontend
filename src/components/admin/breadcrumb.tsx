'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import type { HTMLAttributes } from 'react';

const dict: { [key: string]: string } = {
  myhmm: 'MyHMM',
  mycareer: 'MyCareer',
};

const formatter = (path: string) => {
  let formatted = path.replace('-', ' ');

  return formatted.replace('hmm', 'HMM');
};

export default function AdminBreadcrumb({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const array = pathname.split('/').slice(3);

  if (array.length === 1) return <div></div>;

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
                href={"/portal/admin/" + array.slice(0, index + 1)
                  .join('/')}
                className='capitalize'
              >
                {dict[path] || formatter(path)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== array.length - 1 && (
              <BreadcrumbSeparator key={path + index} />
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
