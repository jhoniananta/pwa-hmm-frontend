import {createSafeActionClient,} from 'next-safe-action';
import {z} from 'zod';
import {verifySession} from '@/lib/session';
import {PWAError} from '@/lib/error';
import {redirect} from 'next/navigation';

export const actionClient = createSafeActionClient({
    handleServerErrorLog(e) {
        console.log("@handleServerErrorLog * e:", e)
        throw {
            message: e.message
        }
    },
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
}).use(async ({next, clientInput, metadata}) => {
    console.log('@Logging Middleware');
    const result = await next({ctx: {}});

    console.log('Result ->', result);
    console.log('Client input ->', clientInput);
    console.log('Metadata ->', metadata);

    return result;
});

export const authActionClient = actionClient
    // Define authorization middleware.
    .use(async ({next}) => {
        const {isAuth, userId} = await verifySession();

        if (!isAuth) {
            return redirect('/sign-in');
        }

        if (!userId) {
            throw new PWAError('Session is not valid!');
        }

        // Return the next middleware with `userId` value in the context
        return next({ctx: {userId}});
    });
