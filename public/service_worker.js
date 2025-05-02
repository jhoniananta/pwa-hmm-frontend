self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }
    const payload = event.data.json();
    const {body, icon, image, badge, url, title} = payload;
    const notificationTitle = title ?? '';

    const notificationOptions = {
        body,
        icon,
        image,
        data: {
            url,
        },
        badge,
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || 'https://google.com';

    event.waitUntil(
        clients.matchAll({type: 'window'}).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

