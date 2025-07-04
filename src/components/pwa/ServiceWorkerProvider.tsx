'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ServiceWorkerContextType {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  updateServiceWorker: () => void;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType>({
  isSupported: false,
  isRegistered: false,
  isOnline: true,
  updateAvailable: false,
  registration: null,
  updateServiceWorker: () => {},
});

export function useServiceWorker() {
  return useContext(ServiceWorkerContext);
}

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      registerServiceWorker();
    }

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);
      setIsRegistered(true);

      console.log('Service Worker registered successfully:', reg);

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              setUpdateAvailable(true);
              console.log('New service worker available');
            }
          });
        }
      });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service worker has been updated and is now controlling the page
        window.location.reload();
      });

      // Check for waiting service worker
      if (reg.waiting) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting and become active
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const value: ServiceWorkerContextType = {
    isSupported,
    isRegistered,
    isOnline,
    updateAvailable,
    registration,
    updateServiceWorker,
  };

  return <ServiceWorkerContext.Provider value={value}>{children}</ServiceWorkerContext.Provider>;
}

// Hook for background sync
export function useBackgroundSync() {
  const { registration } = useServiceWorker();

  const sync = async (tag: string) => {
    if (!registration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      await (
        registration as unknown as { sync: { register: (tag: string) => Promise<void> } }
      ).sync.register(tag);
      console.log('Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  };

  return { sync };
}

// Hook for push notifications
export function usePushNotifications() {
  const { registration } = useServiceWorker();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const subscribe = async (vapidPublicKey: string): Promise<PushSubscription | null> => {
    if (!registration || permission !== 'granted') {
      console.warn('Cannot subscribe: no registration or permission denied');
      return null;
    }

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(sub);
      console.log('Push subscription created:', sub);
      return sub;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      const result = await subscription.unsubscribe();
      if (result) {
        setSubscription(null);
        console.log('Push subscription cancelled');
      }
      return result;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  };

  return {
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Component for showing update notification
export function UpdateNotification() {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowNotification(true);
    }
  }, [updateAvailable]);

  if (!showNotification) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md">
      <div className="bg-primary-600 rounded-lg p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">应用更新可用</h4>
            <p className="text-primary-100 text-sm">点击更新以获取最新功能</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNotification(false)}
              className="text-primary-100 hover:text-white"
            >
              稍后
            </button>
            <button
              onClick={() => {
                updateServiceWorker();
                setShowNotification(false);
              }}
              className="text-primary-600 hover:bg-primary-50 rounded bg-white px-3 py-1 text-sm font-medium"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for offline indicator
export function OfflineIndicator() {
  const { isOnline } = useServiceWorker();
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
    } else {
      // Hide after a delay when back online
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOffline) return null;

  return (
    <div className="fixed top-4 right-4 left-4 z-50 mx-auto max-w-md">
      <div
        className={`rounded-lg p-3 text-center text-sm font-medium shadow-lg transition-colors ${
          isOnline ? 'bg-success-600 text-white' : 'bg-warning-600 text-white'
        }`}
      >
        {isOnline ? '✅ 已重新连接' : '📱 离线模式 - 部分功能可能受限'}
      </div>
    </div>
  );
}
