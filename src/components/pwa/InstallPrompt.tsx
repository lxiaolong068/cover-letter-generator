'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  className?: string;
  onInstall?: () => void;
  onDismiss?: () => void;
}

export function InstallPrompt({ className, onInstall, onDismiss }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Check for iOS Safari
      if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay to avoid being too aggressive
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      onInstall?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();

    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // Check if user has dismissed in this session
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <Card className={cn('animate-slide-up fixed right-4 bottom-4 z-50 max-w-sm', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="text-xl">📱</span>
            </div>
            <div>
              <CardTitle className="text-base">安装应用</CardTitle>
              <CardDescription className="text-sm">获得更好的体验</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-on-surface-variant hover:text-on-surface h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-on-surface-variant mb-4 text-sm">
          Add Cover Letter Generator to your home screen for a native app experience.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstallClick} className="flex-1">
            安装
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            稍后
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for PWA installation status
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }

      if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        setIsInstalled(true);
        return true;
      }

      return false;
    };

    if (checkInstalled()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setIsInstallable(false);

      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
  };
}

// Component for iOS Safari install instructions
export function IOSInstallInstructions({ className }: { className?: string }) {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if iOS Safari and not installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isInStandaloneMode && !isInstalled) {
      // Show instructions after a delay
      setTimeout(() => {
        setShowInstructions(true);
      }, 5000);
    }
  }, []);

  if (!showInstructions) return null;

  return (
    <Card className={cn('animate-slide-up fixed right-4 bottom-4 left-4 z-50', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📱</span>
          安装到主屏幕
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <p>在Safari中安装此应用到主屏幕：</p>
          <ol className="text-on-surface-variant list-inside list-decimal space-y-1">
            <li>
              点击底部的分享按钮 <span className="inline-block">📤</span>
            </li>
            <li>向下滚动并点击&ldquo;添加到主屏幕&rdquo;</li>
            <li>点击&ldquo;添加&rdquo;确认安装</li>
          </ol>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowInstructions(false)}>
            知道了
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
