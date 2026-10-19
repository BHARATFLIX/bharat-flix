const CACHE = "bharatflix-v2-clean";
const STATIC_FILES = ["./logo.png", "./apk-icon.png", "./manifest.json"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_FILES))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => {
        if(k !== CACHE) return caches.delete(k);
      }))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // index.html के लिए हमेशा नया वाला लाओ, पुराना मत दिखाओ
  if(e.request.mode === 'navigate' || e.request.url.includes('index.html') || e.request.url.endsWith('/bharat-flix/') || e.request.url.endsWith('/')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  // बाकी logo वगैरह Cache से
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
