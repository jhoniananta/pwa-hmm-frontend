import EditProfile from './client';
import { getFullUser } from '@/lib/dal';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getFullUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return <EditProfile user={user} />;
}