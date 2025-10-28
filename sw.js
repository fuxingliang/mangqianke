const CACHE_NAME = 'maqianke-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg'
];

// 安装事件：预缓存基础文件，并立即激活新SW
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// 激活事件：清理旧缓存，并立即接管页面
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 获取事件：
// - 对HTML导航请求使用网络优先（确保最新页面和脚本入口）
// - 对脚本和样式使用网络优先（避免旧版本缓存）
// - 其它资源使用缓存优先作为回退
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const destination = req.destination;

  // HTML文档（导航）使用网络优先
  if (req.mode === 'navigate' || destination === 'document') {
    event.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 脚本与样式使用网络优先，避免旧版本
  if (destination === 'script' || destination === 'style') {
    event.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 其它资源缓存优先
  event.respondWith(
    caches.match(req).then((response) => response || fetch(req))
  );
});