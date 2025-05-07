// import 'server-only';

import {IoMdNotificationsOutline} from 'react-icons/io';
import {IoSettingsOutline} from 'react-icons/io5';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import Link from 'next/link';
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip';
import {getUser} from '@/lib/dal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Bell, Settings, User} from 'lucide-react';
import {InstallPWA} from '../install-pwa';
import {getPublicUrl} from "@/_actions/utils/utils";

const ProfileMenu = async () => {
    const user = await getUser();
    const s3AvatarUrl = user?.avatar ? await getPublicUrl(user.avatar) : '';

    return (
        <div className='flex gap-3 items-center'>
            <Tooltip>
                <TooltipTrigger className='bg-white p-2 rounded-full text-lg hidden md:block'>
                    <IoMdNotificationsOutline/>
                </TooltipTrigger>
                <TooltipContent className='hidden md:block'>
                    <p>Notifications</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger className='bg-white p-2 rounded-full text-lg hidden md:block'>
                    <IoSettingsOutline/>
                </TooltipTrigger>
                <TooltipContent className='hidden md:block'>
                    <p>Settings</p>
                </TooltipContent>
            </Tooltip>
            <InstallPWA/>
            <Tooltip>
                <TooltipTrigger className='hidden md:block'>
                    <Link
                        href='/profile'
                        className='flex items-center gap-2 ml-2'
                    >
                        <div className='*:text-[0.625rem]'>
                            <p className='font-semibold'>{user?.name}</p>
                            <p className='text-abu-3'>{user?.role}</p>
                        </div>
                        <Avatar>
                            <AvatarImage
                                src={s3AvatarUrl}
                                alt='avatar'
                            />
                            <AvatarFallback className='bg-white'>
                                {user?.name.split(' ').map((t: string) => t[0])}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </TooltipTrigger>
                <TooltipContent className='hidden md:block'>
                    <p>Profile</p>
                </TooltipContent>
            </Tooltip>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center gap-2 ml-2 md:hidden'>
                    <div className='*:text-[0.625rem]'>
                        <p className='font-semibold'>{user?.name}</p>
                        <p className='text-abu-3'>{user?.role}</p>
                    </div>
                    <Avatar>
                        <AvatarImage
                            src={s3AvatarUrl}
                            alt='avatar'
                        />
                        <AvatarFallback className='bg-white'>
                            {user?.name.split(' ').map((t: string) => t[0])}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-48 border border-navy/30'>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href='/profile' className='flex'>
                                <User className='mr-2 w-4 h-4'/>
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell className='mr-2 w-4 h-4'/>
                            <span>Notifications</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className='mr-2 w-4 h-4'/>
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ProfileMenu;
