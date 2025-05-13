'use client';
import { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import Link from 'next/link';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { InstallPWA } from '../install-pwa';
import NotificationModal from './notification-modal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Bell, Settings, User } from 'lucide-react';

export interface ProfileMenuClientProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  avatarUrl: string;
}

export default function ProfileMenuClient({
  user,
  avatarUrl,
}: ProfileMenuClientProps) {
  const [isNotifOpen, setNotifOpen] = useState(false);

  return (
    <div className='flex gap-3 items-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className='bg-white p-2 rounded-full text-lg hidden md:block'
            onClick={() => setNotifOpen(true)}
          >
            <IoMdNotificationsOutline />
          </button>
        </TooltipTrigger>
        <TooltipContent className='hidden md:block'>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>

      <NotificationModal
        open={isNotifOpen}
        onClose={() => setNotifOpen(false)}
      />

      <Tooltip>
        <TooltipTrigger className='bg-white p-2 rounded-full text-lg hidden md:block'>
          <IoSettingsOutline />
        </TooltipTrigger>
        <TooltipContent className='hidden md:block'>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <InstallPWA />

      <Tooltip>
        <TooltipTrigger className='hidden md:block'>
          <Link href='/profile' className='flex items-center gap-2 ml-2'>
            <div className='*:text-[0.625rem]'>
              <p className='font-semibold'>{user.name}</p>
              <p className='text-abu-3'>{user.role}</p>
            </div>
            <Avatar>
              <AvatarImage src={avatarUrl} alt='avatar' />
              <AvatarFallback className='bg-white'>
                {user.name
                  .split(' ')
                  .map((t) => t[0])
                  .join('')}
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
            <p className='font-semibold'>{user.name}</p>
            <p className='text-abu-3'>{user.role}</p>
          </div>
          <Avatar>
            <AvatarImage src={avatarUrl} alt='avatar' />
            <AvatarFallback className='bg-white'>
              {user.name
                .split(' ')
                .map((t) => t[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-48 border border-navy/30'>
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href='/profile' className='flex'>
                <User className='mr-2 w-4 h-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotifOpen(true)}>
              <Bell className='mr-2 w-4 h-4' />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className='mr-2 w-4 h-4' />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
