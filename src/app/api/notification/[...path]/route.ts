import {env} from "@/env";
import {NextRequest} from "next/server";
import webpush from 'web-push';
import {getUserId} from "@/_actions/session-action";
import axios from "axios";

webpush.setVapidDetails(
    'mailto:mail@example.com',
    env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
);

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
    console.log(`request: ${request}`)

    const body: { subscription: PushSubscription, deviceId: string } = await request.json();
    const subscription = body.subscription;
    const deviceId = body.deviceId;
    const userId = await getUserId() ?? -1;

    await axios.post(`${env.API_URL}/push-objects`, {
        deviceId,
        userId: userId,
        pushObjectString: JSON.stringify(subscription)
    });

    return new Response(JSON.stringify({message: 'Subscription set.'}), {});
}

async function sendPush(request: NextRequest) {
    const body = await request.json();
    const pushPayload = JSON.stringify(body);
    await webpush.sendNotification(body.pushObjectString ? JSON.parse(body.pushObjectString) : {} as any, pushPayload);
    return new Response(JSON.stringify({message: 'Push sent.'}), {});
}

async function notFoundApi() {
    return new Response(JSON.stringify({error: 'Invalid endpoint'}), {
        headers: {'Content-Type': 'application/json'},
        status: 404,
    });
}