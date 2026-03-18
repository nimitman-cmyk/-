const CACHE_NAME = 'aroma-elite-v1';
const assets = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. ติดตั้ง Service Worker และเก็บไฟล์ลง Cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // บังคับให้เริ่มทำงานทันที
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. ลบ Cache เก่าทิ้ง เมื่อมีการอัปเดตเวอร์ชัน (เช่น เปลี่ยน v1 เป็น v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});

// 3. ดึงข้อมูลมาใช้งาน (Offline Support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // คืนค่าจาก Cache ถ้ามี ถ้าไม่มีให้ไปโหลดจากเน็ต
      return response || fetch(event.request).catch(() => {
        // กรณีไม่มีเน็ตและไม่มีใน Cache (เช่น ลืมเก็บไฟล์รูปใหม่ลง Cache)
        return caches.match('index.html');
      });
    })
  );
});