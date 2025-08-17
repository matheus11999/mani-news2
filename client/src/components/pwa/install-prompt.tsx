import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-2xl p-5 z-50 max-w-md mx-auto border-2 border-white/20 backdrop-blur-sm">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Download className="text-white h-6 w-6" />
        </div>
        <div className="flex-1 text-white">
          <h4 className="font-bold text-base mb-1">📱 Instalar Mani News</h4>
          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Tenha acesso rápido às notícias direto na tela inicial do seu dispositivo!
          </p>
          <Button 
            size="sm"
            className="bg-white text-primary hover:bg-white/90 text-sm px-6 py-2 font-semibold w-full"
            onClick={handleInstall}
            data-testid="button-install-pwa"
          >
            ⚡ Instalar Agora
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDismiss}
          className="text-white hover:bg-white/10 p-1 self-start"
          data-testid="button-close-install"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
