export function getDurationString(seconds: number): string {
    const h: number = Math.floor(seconds / 3600);
    const m: number = Math.floor((seconds % 3600) / 60);

    return (h === 0 ? '' : `${h} h `) + `${m} m`;
}

export function getRandomValue<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}