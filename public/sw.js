// Service Worker for Siêu Tiện Ích PWA Progressive Web App with Web Push Notifications
const CACHE_NAME = 'sieutienich-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// WEB PUSH NOTIFICATION BACKGROUND RECEIVER
self.addEventListener('push', (event) => {
  let data = {
    title: '🆘 Siêu Tiện Ích SOS Notification',
    body: 'Bạn có thông báo mới từ hệ thống!',
    soundType: 'chime',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || 'Bạn có đơn hàng/tin nhắn mới!',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: data.soundType === 'emergency' ? [300, 100, 300, 100, 300, 100, 300] : [200, 100, 200],
    data: data.url || '/',
    tag: data.tag || 'sieutienich-push',
    requireInteraction: data.soundType === 'emergency',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Siêu Tiện Ích Platform', options)
  );
});

// HANDLE NATIVE NOTIFICATION BANNER TAP / CLICK
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
