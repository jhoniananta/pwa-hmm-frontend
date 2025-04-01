'use client';

import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { FiDownload } from 'react-icons/fi';

export function InstallPWA({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      console.log('Install prompt captured'); // Debug log
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    // Add the event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handler as any);
    }

    window.addEventListener('appinstalled', () => {
      console.log('App installed'); // Debug log
      setIsInstalled(true);
    });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handler as any);
        window.removeEventListener('appinstalled', () => setIsInstalled(true));
      }
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('Install clicked, deferredPrompt:', deferredPrompt); // Debug log

    if (isInstalled) {
      console.log('App is already installed');
      return;
    }

    if (!deferredPrompt) {
      console.log('Installation prompt not available');
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Installation ${outcome}`); // Debug log

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          className='md:bg-white p-2 rounded-full text-lg '
          onClick={handleInstallClick}
        >
          <FiDownload />
        </TooltipTrigger>
        <TooltipContent className='hidden md:block'>
          <p>{isInstalled ? 'Already Installed' : 'Install App'}</p>
        </TooltipContent>
      </Tooltip>

    </>
  );
} 