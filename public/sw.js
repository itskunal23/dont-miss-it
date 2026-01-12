// Service Worker for Dont Miss It PWA
const CACHE_NAME = 'dont-miss-it-v2'
const urlsToCache = [
  '/',
  '/app',
  '/app/queue',
  '/app/insights',
  '/app/settings',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cache for root page to always get latest version
  if (event.request.url.includes('/') && event.request.url.endsWith('/')) {
    event.respondWith(fetch(event.request))
    return
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
