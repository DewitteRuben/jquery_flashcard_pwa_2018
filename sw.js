var cacheName = "v1";
//
var cacheFiles = [
    ".",
    "index.html",
    "addcard.html",
    "addcardset.html",
    "cardgame.html",
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
    "js/utilities.js"
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

(function() {
    var nativeAddAll = Cache.prototype.addAll;
    var userAgent = navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);

    // Has nice behavior of `var` which everyone hates
    if (userAgent) {
        var agent = userAgent[1];
        var version = parseInt(userAgent[2]);
    }

    if (
        nativeAddAll && (!userAgent ||
            (agent === 'Firefox' && version >= 46) ||
            (agent === 'Chrome'  && version >= 50)
        )
    ) {
        return;
    }

    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;

        // Since DOMExceptions are not constructable:
        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }

        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve().then(function() {
            if (arguments.length < 1) throw new TypeError();

            // Simulate sequence<(Request or USVString)> binding:
            var sequence = [];

            requests = requests.map(function(request) {
                if (request instanceof Request) {
                    return request;
                }
                else {
                    return String(request); // may throw TypeError
                }
            });

            return Promise.all(
                requests.map(function(request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    var scheme = new URL(request.url).protocol;

                    if (scheme !== 'http:' && scheme !== 'https:') {
                        throw new NetworkError("Invalid scheme");
                    }

                    return fetch(request.clone());
                })
            );
        }).then(function(responses) {
            // If some of the responses has not OK-eish status,
            // then whole operation should reject
            if (responses.some(function(response) {
                return !response.ok;
            })) {
                throw new NetworkError('Incorrect response status');
            }

            // TODO: check that requests don't overwrite one another
            // (don't think this is possible to polyfill due to opaque responses)
            return Promise.all(
                responses.map(function(response, i) {
                    return cache.put(requests[i], response);
                })
            );
        }).then(function() {
            return undefined;
        });
    };

    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}());


self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("Cashing files");
            return cache.addAll(cacheFiles);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log(response, "response");
            console.log(event.request, "request");
            return response || fetch(event.request);
        })
    );
});
