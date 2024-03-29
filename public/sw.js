const VERSION = 'v1';

self.addEventListener('install', function (event) {
  self.skipWaiting(); // 立即激活新的Service Worker
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim() // 立即控制所有客户端
  );
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  // 检查请求是否以"/assets"或"/public"开头
  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith('/assets')
    || pathname.startsWith('/fonts')
    || pathname.startsWith('/images')
    || pathname.startsWith('/fontawesome')
    || pathname.startsWith('/js')
    || pathname.startsWith('/_astro')
    || pathname.startsWith('/favicon.ico')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response; // 如果缓存中存在匹配的响应，则直接返回缓存的响应
          } else {
            return fetch(event.request)
              .then(function (response) {
                return caches.open(VERSION)
                  .then(function (cache) {
                    cache.put(event.request, response.clone()); // 将响应添加到缓存中
                    return response;
                  });
              });
          }
        })
    );
    return;
  }

  event.respondWith(fetch(event.request));
});