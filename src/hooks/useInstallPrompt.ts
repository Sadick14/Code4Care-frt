import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check localStorage for previous dismissal
    const wasDismissed = localStorage.getItem('pwa_install_dismissed') === 'true';
    setIsDismissed(wasDismissed);
    console.log('[PWA] Checking dismissal status:', wasDismissed);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      console.log('[PWA] beforeinstallprompt event fired');
      setInstallPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App was installed successfully');
      setInstallPrompt(null);
      setIsInstallable(false);
      localStorage.removeItem('pwa_install_dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    console.log('[PWA] Listeners attached');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.warn('[PWA] Install attempted but no prompt available');
      return;
    }

    try {
      console.log('[PWA] Prompting user to install...');
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        setInstallPrompt(null);
        setIsInstallable(false);
        localStorage.removeItem('pwa_install_dismissed');
      } else {
        console.log('[PWA] User dismissed installation prompt');
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    console.log('[PWA] User dismissed install banner');
    setIsDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
    setInstallPrompt(null);
  };

  const resetDismissal = () => {
    console.log('[PWA] Resetting PWA dismissal flag');
    setIsDismissed(false);
    localStorage.removeItem('pwa_install_dismissed');
  };

  return {
    installPrompt,
    isInstallable: isInstallable && !isDismissed,
    handleInstall,
    handleDismiss,
    resetDismissal,
  };
};
