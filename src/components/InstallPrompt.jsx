import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (new Date() - dismissedDate) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return; // Don't show for 7 days after dismissal
      }
    }

    // Listen for install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-6 z-50 border-2 border-pink-200 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-3">
          <Download className="text-white" size={24} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-2">Install Plan My Party Pal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add to your home screen for quick access and offline support!
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 text-gray-600 hover:text-gray-800 font-semibold"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
