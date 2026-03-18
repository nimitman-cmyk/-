const CACHE_NAME = 'aroma-elite-v1';
const assets = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// ขั้นตอน Install และเก็บไฟล์ลง Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// ขั้นตอน Fetch (ดึงข้อมูลมาใช้แม้ไม่มีเน็ต)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});