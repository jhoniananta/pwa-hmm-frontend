import Icon from '@/components/ui/button/icon';
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5';
import { BsTelephone } from 'react-icons/bs';
import { getFullUser } from '@/lib/dal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditProfile from './edit-profile-button';
import AvatarUpload from '@/components/client/avatar-upload';

const ProfilePage = async () => {
  const user = await getFullUser();

  if (!user) {
    return <div className='w-full h-full flex place-items-center'>Failed to fetch user data</div>;
  }

  const {
    name,
    avatar,
    email,
    phoneNumber,
    NIM,
    medicalHistories,
    hobbies,
    emergencyNumber,
    lineId,
    UKM,
    dateOfBirth,
    address,
    bloodType,
    about,
  } = user;

  return (
    <main className='flex flex-col items-stretch w-full h-max gap-6 relative'>
      <div className='rounded-xl flex flex-col flex-1 bg-white'>
        <AvatarUpload
          currentAvatar={avatar}
          name={name}
        />
        <div className='flex gap-6 md:gap-8 flex-col md:px-16 px-8 md:py-8 py-8 shadow-md'>
          <div className=''>
            <h1 className='text-xl font-bold'>{name}</h1>
            <h3 className='text-sm'>{NIM}</h3>
            <h5 className='text-abu-3 text-xs'>Mechanical Engineering</h5>
          </div>
          <div className='md:flex gap-10 space-y-4 md:space-y-0 *:items-center items-center'>
            <div className='flex gap-2'>
              <Icon
                icon={<IoLocationOutline />}
                className='bg-oren p-1.5'
              />
              <h6 className='font-2xs'>{address ?? '-'}</h6>
            </div>
            <div className='flex gap-2'>
              <Icon
                icon={<BsTelephone />}
                className='bg-oren p-1.5'
              />
              <h6 className='font-2xs'>{phoneNumber || '-'}</h6>
            </div>
            <div className='flex gap-2'>
              <Icon
                icon={<IoMailOutline />}
                className='bg-oren p-1.5'
              />
              <h6 className='font-2xs'>{email}</h6>
            </div>
          </div>
          <div className='grid w-full grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-y-6 md:gap-y-10'>
            <div className='[&_p]:text-xs [&_p]:font-semibold [&_span]:font-normal space-y-2'>
              <h2 className='text-base'>Biodata</h2>
              <p className=''>
                Tanggal lahir:{' '}
                <span>{new Date(dateOfBirth).toDateString()}</span>
              </p>
              <p className=''>
                Alamat: <span>{address}</span>
              </p>
              <p className=''>
                Golongan darah: <span>{bloodType}</span>
              </p>
              <p className=''>
                Riwayat peyakit: <span>{medicalHistories.join(', ')}</span>
              </p>
            </div>
            <div className='[&_p]:text-xs [&_p]:font-semibold [&_span]:font-normal space-y-2'>
              <h2 className='text-base'>Personal Contact</h2>
              <p className=''>
                ID Line: <span>{lineId}</span>
              </p>
              <p className=''>
                Phone Number: <span>{phoneNumber}</span>
              </p>
              <p className=''>
                emergency Number: <span>{emergencyNumber}</span>
              </p>
            </div>
            <div className='[&_p]:text-xs [&_p]:font-semibold [&_span]:font-normal space-y-2'>
              <h2 className='text-base'>Kemahasiswaan</h2>
              <p className=''>
                Badan HMM: <span></span>
              </p>
              <p className=''>
                Unit Kegiatan Mahasiswa: <span>{UKM.join(", ")}</span>
              </p>
              <p className=''>
                Hobby: <span>{hobbies.join(", ")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const metadata = {
  title: 'Profile',
};

export default ProfilePage;
