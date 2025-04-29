import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import {z} from 'zod';
import {verifySession} from '@/lib/session';
import {PWAError} from '@/lib/error';
import {redirect} from 'next/navigation';

export const actionClient = createSafeActionClient({
    handleServerErrorLog(e) {
        console.log("@handleServerErrorLog * e:", e)
        if (e.message.includes('PWAError')) {
            console.error(e.message.replace('(PWAError)', ''));
        } else {
            console.error(DEFAULT_SERVER_ERROR_MESSAGE);
        }
    },
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
// })
})
    .use(async ({next, clientInput, metadata}) => {
        console.log('@Logging Middleware');
        const result = await next({ctx: {}});

        const data = result.data;
        if (!data) {
            console.log('Result ->', result);
            console.log('Client input ->', clientInput);
            console.log('Metadata ->', metadata);
            return result;
        }

        const copiedResult = JSON.parse(JSON.stringify(result))
        if (data.isError) {
            copiedResult.success = false;
        }

        console.log('Result ->', copiedResult);
        console.log('Client input ->', clientInput);
        console.log('Metadata ->', metadata);

        if (data.isError && !data.isPWAError) {
            throw new Error(data.message)
        }

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
