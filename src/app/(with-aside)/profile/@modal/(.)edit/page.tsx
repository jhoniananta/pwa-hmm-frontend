import EditProfile from '../../edit/client';
import Modal from './modal';
import { getFullUser } from '@/lib/dal';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getFullUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <Modal>
      <EditProfile user={user} />
    </Modal>
  );
}
