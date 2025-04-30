export default function validationErrorToString(validationError: object | undefined): string | undefined {
    if (!validationError) return undefined;

    let error: string = ''
    for (const key in validationError) {
        // @ts-ignore
        const errorMessage = validationError[key];
        if (Array.isArray(errorMessage)) {
            error += errorMessage.join(', ')
        } else if (typeof errorMessage === 'object') {
            error += validationErrorToString(errorMessage);
        } else {
            error += errorMessage
        }
    }
    return error;
}