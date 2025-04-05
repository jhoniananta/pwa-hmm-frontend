export default function getVerboseStatus(): boolean {
    return (typeof process.env.IS_VERBOSE === 'string' && (process.env.IS_VERBOSE as string).toLowerCase() === 'true')
}