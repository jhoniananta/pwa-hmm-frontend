import {redirect} from 'next/navigation';

export class PWAError extends Error {
  constructor(message: string) {
    super(message.includes('(PWAError)') ? message : message + '(PWAError)');
    this.name = "PWAError";
  }
}

export async function handleError(err: { message: string, errorCode: string } | any, name?: string) {
  if (err.errorCode === 'LMS3003') {
    return redirect('/sign-out');
  }

  console.log({ code: err.errorCode, message: err.message, name });

  throw new PWAError(err.message);
}