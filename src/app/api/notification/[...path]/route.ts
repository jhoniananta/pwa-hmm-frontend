import {env} from "@/env";
import {NextRequest} from "next/server";
import webpush from 'web-push';

webpush.setVapidDetails(
    'mailto:mail@example.com',
    env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
);

let subscription: PushSubscription;

export async function POST(request: NextRequest) {
    const {pathname} = new URL(request.url);
    switch (pathname) {
        case '/api/notification/subscription':
            return setSubscription(request);
        case '/api/notification/send':
            return sendPush(request);
        default:
            return notFoundApi();
    }
}

async function setSubscription(request: NextRequest) {
    const body: { subscription: PushSubscription } = await request.json();
    subscription = body.subscription;
    return new Response(JSON.stringify({message: 'Subscription set.'}), {});
}

async function sendPush(request: NextRequest) {
    const body = await request.json();
    const pushPayload = JSON.stringify(body);
    await webpush.sendNotification(body.pushObjectString ? JSON.parse(body.pushObjectString) : subscription as any, pushPayload);
    return new Response(JSON.stringify({message: 'Push sent.'}), {});
}

async function notFoundApi() {
    return new Response(JSON.stringify({error: 'Invalid endpoint'}), {
        headers: {'Content-Type': 'application/json'},
        status: 404,
    });
}