import { getUser } from '@/lib/dal';
import { getPublicUrl } from '@/_actions/utils/utils';
import ProfileMenuClient from './profileMenuClient';

export default async function ProfileMenu() {
  const user = await getUser();
  const avatarUrl = user?.avatar ? await getPublicUrl(user.avatar) : '';

  return user ? <ProfileMenuClient user={user} avatarUrl={avatarUrl} /> : null;
}
