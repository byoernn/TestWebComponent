const VERSION = "0.0.1";
const CACHE_KEY = 'hello-pwa-' + VERSION;
const filesToCache = [
    '/',
    '/index.html',
    // '/components/web.component.js',
    // '/components/components.module.js',
];

 /** @type {ServiceWorkerGlobalScope} */
 const castedSelf = /** @type {any} */ (self);

/**
 * Start the service worker and cache all of the app's content
 * @param {ExtendableEvent} event 
 */
function installEventHandler(event) {
    event.waitUntil(
        caches.open(CACHE_KEY).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
}

/**
 * Here we wait for an ActivateEvent to fire, then we remove any old cache. That is to say, any cache stored 
 * that does not have the same key as the one we defined in CACHE_NAME
 * @param {ExtendableEvent} event 
 */
function activateEventHandler(event) {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_KEY)
                        return caches.delete(cacheName);
                })
            );
        })
    );
}

/**
 * Anytime our website requests a new resource we first check the cache if we have anything available already 
 * and if so, just use that. If not, we retrieve the resource and put it in cache for the next time we may need it.
 * @param {FetchEvent} event 
 */
function fetchEventHandler(event) {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
}

/**
 * we wait for a MessageEvent to fire, 
 * if the message contains skipWaiting we should execute that method
 * @param {MessageEvent} event
 */
function skipWaitingHandler(event) {
    if (event.data === 'skipWaiting') return castedSelf.skipWaiting();
}

castedSelf.addEventListener('message', skipWaitingHandler);

castedSelf.addEventListener('install', installEventHandler);
castedSelf.addEventListener('activate', activateEventHandler);
castedSelf.addEventListener('fetch', fetchEventHandler);