
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

var deferredPrompt;

window.addEventListener('beforeinstallprompt', function (e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  showAddToHomeScreen();

});
function showAddToHomeScreen() {

  var a2hsBtn = document.querySelector(".ad2hs-prompt");

  a2hsBtn.style.display = "block";

  a2hsBtn.addEventListener("click", addToHomeScreen);

}


function addToHomeScreen() {  var a2hsBtn = document.querySelector(".ad2hs-prompt");  // hide our user interface that shows our A2HS button
  a2hsBtn.style.display = 'none';  // Show the prompt
  deferredPrompt.prompt();  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then(function(choiceResult){

  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }

  deferredPrompt = null;

});}




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