
// importScripts('./node_modules/workbox-sw/build/workbox-sw.js')
const staticAssets = [
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
]; 

// const wb = new workbox();

// workbox.precache(staticAssets);

// workbox.precaching.precacheAndRoute(staticAssets);

// workbox.routing.registerRoute(
//     'https://newsapi.org/(.*)',
//     new workbox.strategies.StaleWhileRevalidate()
//   );



self.addEventListener('install', async event=>{
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event=>{
   
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin == location.origin)
    {
        event.respondWith(cacheFirst(req));
    }
    else{
        event.respondWith(networkFirst(req));
    }
    
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
    
}

async function networkFirst(req){
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req,res.clone());
        return res;
        
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
        
    }
}