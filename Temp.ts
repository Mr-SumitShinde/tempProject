function formatTimestamp(latestTimeStamp: string): string {
    const date = new Date(latestTimeStamp);

    const day: string = String(date.getUTCDate()).padStart(2, '0');
    const month: string = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year: number = date.getUTCFullYear();

    let hours: number = date.getUTCHours();
    const minutes: string = String(date.getUTCMinutes()).padStart(2, '0');
    const isAM: boolean = hours < 12;
    const period: string = isAM ? 'AM' : 'PM';

    if (hours === 0) {
        hours = 12;
    } else if (hours > 12) {
        hours -= 12;
    }
    const formattedHours: string = String(hours).padStart(2, '0');

    const timeZoneOffset: number = date.getTimezoneOffset() / 60;
    const timeZone: string = `GMT${timeZoneOffset > 0 ? '-' : '+'}${Math.abs(timeZoneOffset)}`;

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${period} (${timeZone})`;
}

const input: string = "2024-04-10T11:40:32";
console.log(formatTimestamp(input));