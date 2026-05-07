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

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setInstallPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setInstallPrompt(null);
      setIsInstallable(false);
      localStorage.removeItem('pwa_install_dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        setInstallPrompt(null);
        setIsInstallable(false);
        localStorage.removeItem('pwa_install_dismissed');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
    setInstallPrompt(null);
  };

  const resetDismissal = () => {
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
