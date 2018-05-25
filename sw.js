var cacheName = "v2";
//
var cacheFiles = [
    ".",
    "index.html",
    "addcard.html",
    "addcardset.html",
    "cardgame.html",
    "settings.html",
    "css/screen.css",
    "css/materialize.min.css",
    "css/font-awesome.min.css",
    "js/addcard.js",
    "js/addcardset.js",
    "js/DataModule.js",
    "js/DomainModule.js",
    "js/GameModule.js",
    "js/gamePage.js",
    "js/index.js",
    "js/jquery-3.3.1.min.js",
    "js/localforage.min.js",
    "js/materialize.min.js",
    "js/materializeinit.js",
    "js/translate.js",
    "js/utilities.js",
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("Cashing files");
            return cache.addAll(cacheFiles);
        })
    );
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                var fetchPromise = fetch(event.request).then(function(networkResponse) {
                    console.log("Fetching from internet");
                    cache.put(event.request, networkResponse.clone());
                    console.log("Cached the response", networkResponse.clone());
                    return networkResponse;
                }).catch(function() {
                    console.log("Failed to update cache, network unavailable");
                });
                return response || fetchPromise;
            }).catch(function() {
                console.log("Failed to match cache and to update from the network");
            })
        })
    );
});

