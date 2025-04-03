export default function getVerboseStatus(): boolean {
    return (process.env.NODE_ENV as string).toLowerCase() === 'development'
}