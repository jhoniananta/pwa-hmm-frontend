import {redirect} from 'next/navigation';

export class PWAError extends Error {
    constructor(message: string, cause?: any) {
        console.log('@PWAError * cause:', cause)

        super(message.includes('(PWAError)') ? message : message + ' (PWAError)');
    }
}

export function handleError(err: { message: string, errorCode: string } | any, name?: string) {
    if (Number(err.errorCode) === 401) {
        return redirect('/sign-out');
    }

    throw new PWAError(err.message);
}