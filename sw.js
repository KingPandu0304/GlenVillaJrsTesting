const CACHE_NAME = 'glen-villa-v1.2.0';
const STATIC_CACHE = 'glen-villa-static-v1.2.0';
const DYNAMIC_CACHE = 'glen-villa-dynamic-v1.2.0';
const APP_SCOPE = self.registration.scope;
const appUrl = (path) => new URL(path, APP_SCOPE).toString();

// Files to cache immediately
const STATIC_ASSETS = [
  appUrl('./'),
  appUrl('./index.html'),
  appUrl('./style.css'),
  appUrl('./main.js'),
  appUrl('./manifest.json'),
  appUrl('./logo.png'),
  appUrl('./teams.json'),
  appUrl('./news.json'),
  appUrl('./sponsors.json')
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Handle API calls (JSON files)
  if (request.url.includes('.json')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request)
            .then(response => {
              // Cache successful responses
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // Return cached version if network fails
              return cachedResponse || new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Default strategy: Cache-first for static assets, network-first for HTML
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful HTML responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if offline
          return caches.match(request) || caches.match(appUrl('./index.html'));
        })
    );
  } else {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request)
            .then(response => {
              if (response.ok && request.method === 'GET') {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any offline actions here
  console.log('[SW] Performing background sync');
}

// Push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);

  const options = {
    body: event.data ? event.data.text() : 'New update from Glen Villa Juniors!',
    icon: appUrl('./logo.png'),
    badge: appUrl('./logo.png'),
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: appUrl('./logo.png')
      },
      {
        action: 'close',
        title: 'Close',
        icon: appUrl('./logo.png')
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Glen Villa Juniors FC', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(appUrl('./index.html'))
    );
  }
});