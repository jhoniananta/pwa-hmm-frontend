const SERVICE_WORKER_FILE_PATH = './service_worker.js';

export function notificationUnsupported(): boolean {
    let unsupported = false;
    if (
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('showNotification' in ServiceWorkerRegistration.prototype)
    ) {
        unsupported = true;
    }
    return unsupported;
}

export function checkPermissionStateAndAct(
    onSubscribe: (subs: PushSubscription | null) => void, deviceId: string,
): void {
    const state: NotificationPermission = Notification.permission;
    switch (state) {
        case 'denied':
            break;
        case 'granted':
            registerAndSubscribe(onSubscribe, deviceId);
            break;
        case 'default':
            onSubscribe(null)
            break;
    }
}

async function subscribe(onSubscribe: (subs: PushSubscription | null) => void, deviceId: string): Promise<void> {
    navigator.serviceWorker.ready
        .then((registration: ServiceWorkerRegistration) => {
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });
        })
        .then((subscription: PushSubscription) => {
            submitSubscription(subscription, deviceId).then(_ => {
                onSubscribe(subscription);
            });
        })
        .catch(e => {
            console.error('Failed to subscribe cause of: ', e);
        });
}

async function submitSubscription(subscription: PushSubscription, deviceId: string): Promise<void> {
    const endpointUrl = '/api/notification/subscription';
    const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({subscription, deviceId}),
    });
    const result = await res.json();
}

export async function registerAndSubscribe(
    onSubscribe: (subs: PushSubscription | null) => void, deviceId: string
): Promise<void> {
    try {
        await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
        await subscribe(onSubscribe, deviceId);
    } catch (e) {
        console.error('Failed to register service-worker: ', e);
    }
}

export async function sendWebPush(message: string | null): Promise<void> {
    const endPointUrl = '/api/notification/send';
    const pushBody = {
        title: 'New Assignment!',
        body: message ?? 'This is a test push message',
        image: 'https://myhmm-bucket.s3.ap-southeast-3.amazonaws.com/public/logo.png',
        icon: 'https://myhmm-bucket.s3.ap-southeast-3.amazonaws.com/public/logo.png',
        url: '/assignments',
    };
    const res = await fetch(endPointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pushBody),
    });
    const result = await res.json();
}
