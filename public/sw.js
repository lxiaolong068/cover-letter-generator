// Service Worker for Cover Letter Generator PWA
const STATIC_CACHE_NAME = 'cover-letter-static-v1';
const DYNAMIC_CACHE_NAME = 'cover-letter-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/dashboard/generate',
  '/dashboard/templates',
  '/dashboard/history',
  '/offline',
  '/manifest.json',
  // Add your CSS and JS files here
  '/_next/static/css/app.css',
  // Add critical images
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints that should be cached
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CACHEABLE_APIS = [
  '/api/templates',
  '/api/user/profile',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - cache with network first strategy
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first strategy
    event.respondWith(handleStaticAssets(request));
  } else {
    // Page requests - network first with offline fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API should be cached
  const shouldCache = CACHEABLE_APIs.some(api => url.pathname.startsWith(api));
  
  if (!shouldCache) {
    return fetch(request);
  }

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response if no cache available
    return new Response(
      JSON.stringify({ error: 'Network error and no cached data available' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    throw error;
  }
}

// Handle page requests with network-first strategy and offline fallback
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Show offline page as fallback
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Final fallback - basic offline message
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>离线模式 - 求职信生成器</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              background: #f8fafc;
              color: #334155;
            }
            .offline-message { 
              text-align: center; 
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .offline-icon { 
              font-size: 4rem; 
              margin-bottom: 1rem; 
            }
            h1 { 
              margin: 0 0 1rem 0; 
              color: #1e293b;
            }
            p { 
              margin: 0; 
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <div class="offline-icon">📱</div>
            <h1>您当前处于离线状态</h1>
            <p>请检查网络连接后重试</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}

// Handle background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'cover-letter-sync') {
    event.waitUntil(syncCoverLetters());
  }
});

// Sync cover letters when back online
async function syncCoverLetters() {
  try {
    // Get pending cover letters from IndexedDB
    const pendingData = await getPendingCoverLetters();
    
    for (const data of pendingData) {
      try {
        const response = await fetch('/api/cover-letters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingCoverLetter(data.id);
        }
      } catch (error) {
        console.error('Failed to sync cover letter:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingCoverLetters() {
  // Implement IndexedDB read operation
  return [];
}

async function removePendingCoverLetter(id) {
  // Implement IndexedDB delete operation
  console.log('Removing pending cover letter:', id);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: '查看',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: '忽略',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});
