var cacheName = "v2";
var cacheFiles = [
    "./",
    "./index.html",
    "./addcard.html",
    "./addcardset.html",
    "./cardgame.html",
    "./css/screen.css",
    "./css/materialize.css",
    "./css/animsition.css",
    "./css/font-awesome.min.css",
    "./js/addcard.js",
    "./js/addcardset.js",
    "./js/animsition.min.js",
    "./js/animsitioninit.js",
    "./js/DataModule.js",
    "./js/DomainModule.js",
    "./js/gamePage.js",
    "./js/index.js",
    "./js/jquery-3.3.1.min.js",
    "./js/localforage.min.js",
    "./js/materialize.min.js",
    "./js/materializeinit.js",
    "./js/translate.js",
    "./js/utilities.js"
];


self.addEventListener("install", function(e){
    console.log("Serviceworker installed");

    e.waitUntil(

        caches.open(cacheName).then(function(cache) {
            console.log("Service worker caching cachefiles");
            return cache.addAll(cacheFiles);
        })
    )

});
self.addEventListener("activate", function(e){
    console.log("Serviceworker activated");

    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log("Removeing cached files from ", thisCacheName)
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);

    // e.respondWidth Responds to the fetch event
    e.respondWith(

        // Check in cache for the request being made
        caches.match(e.request)


            .then(function(response) {

                // If the request is in the cache
                if ( response ) {
                    console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                    // Return the cached version
                    return response;
                }

                // If the request is NOT in the cache, fetch and cache

                var requestClone = e.request.clone();
                fetch(requestClone)
                    .then(function(response) {

                        if ( !response ) {
                            console.log("[ServiceWorker] No response from fetch ")
                            return response;
                        }

                        var responseClone = response.clone();

                        //  Open the cache
                        caches.open(cacheName).then(function(cache) {

                            // Put the fetched response in the cache
                            cache.put(e.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', e.request.url);

                            // Return the response
                            return response;

                        }); // end caches.open

                    })
                    .catch(function(err) {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });


            }) // end caches.match(e.request)
    ); // end e.respondWith
});