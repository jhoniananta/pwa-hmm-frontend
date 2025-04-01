import { Drawer, Sidebar } from '@/components/client/aside';

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <Drawer>{children}</Drawer>
      <Sidebar />
    </nav>
  );
}
