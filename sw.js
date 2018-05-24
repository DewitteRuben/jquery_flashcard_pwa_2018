var cacheName = "v1";
//
var cacheFiles = [
    "/index.html",
    "/addcard.html",
    "/addcardset.html",
    "/cardgame.html",
    "/css/screen.css",
    "/css/materialize.css",
    "/css/font-awesome.min.css",
    "/js/addcard.js",
    "/js/addcardset.js",
    "/js/DataModule.js",
    "/js/DomainModule.js",
    "/js/gamePage.js",
    "/js/index.js",
    "/js/jquery-3.3.1.min.js",
    "/js/localforage.min.js",
    "/js/materialize.min.js",
    "/js/materializeinit.js",
    "/js/translate.js",
    "/js/utilities.js"
];
//
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(cacheName).then(function(cache) {
//             return cache.addAll(cacheFiles);
//         })
//     );
// });
//
// self.addEventListener('fetch', event => {
//     // Let the browser do its default thing
//     // for non-GET requests.
//     if (event.request.method !== 'GET') return;
//
//     // Prevent the default, and handle the request ourselves.
//     event.respondWith(async function() {
//         // Try to get the response from a cache.
//         const cache = await caches.open(cacheName);
//         const cachedResponse = await cache.match(event.request);
//
//         if (cachedResponse) {
//             // If we found a match in the cache, return it, but also
//             // update the entry in the cache in the background.
//             event.waitUntil(cache.add(event.request));
//             return cachedResponse;
//         }
//
//         // If we didn't find a match in the cache, use the network.
//         return fetch(event.request);
//     }());
// });
//


importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});


self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log(response, "response");
            console.log(event.request, "request");
            return response || fetch(event.request);
        })
    );
});