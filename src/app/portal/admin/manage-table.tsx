import { Table, TableBody } from '@/components/ui/table';
import { type TableHTMLAttributes } from 'react';

type ManageTableProps = TableHTMLAttributes<HTMLTableElement> 

export default function ManageTable({ children, ...props }: ManageTableProps) {
  return (
    <Table className='table-admin' {...props}>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  );
}