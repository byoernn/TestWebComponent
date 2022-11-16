/** @type {boolean} */
let isReloading = false;

/**
 * Show the UI that will be presented when an update is found
 * @param {ServiceWorker} serviceWorker 
 */
function presentUpdateAvailable(serviceWorker) {
    let updateBtn = document.querySelector("#update-btn");
    updateBtn.removeAttribute("disabled")
    updateBtn.addEventListener("click", (event) => {
        serviceWorker.postMessage('skipWaiting');
    });
}

window.addEventListener("load", async (ev) => {
    if ('serviceWorker' in navigator) {
        let registration = await navigator.serviceWorker.register('index.sw.js');

        if (registration.waiting) presentUpdateAvailable(registration.waiting);

        registration.addEventListener("updatefound", (event) => {
            // Ignore the event if this is our first service worker and thus not an update
            if (!registration.active) return;

            // Listen for any state changes on the new service worker
            registration.installing.addEventListener('statechange', statechangeevent => {
                // Wait for the service worker to enter the installed state                
                /** @type {ServiceWorker} */
                let worker = /** @type {any} */ (statechangeevent.target);
                if (worker.state !== 'installed') return;

                // Present the update available UI
                presentUpdateAvailable(registration.waiting);
            });
        });

        navigator.serviceWorker.addEventListener('controllerchange', (event) => {
            // We delay our code until the new service worker is activated
            /** @type {ServiceWorkerContainer} */
            let container = /** @type {any} */ (event.target);
            container.ready.then(swregistration => {

                // Reload the window
                if (!isReloading) {
                    isReloading = true;
                    window.location.reload();
                }
            });
        });
    }
});