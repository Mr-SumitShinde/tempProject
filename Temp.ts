type FormatOptions = {
    timeZone?: string;
    includeTimeZoneSuffix?: boolean;
};

function formatTimestamp(
    serverTimestamp: string,
    options: FormatOptions = { timeZone: 'Etc/GMT-1', includeTimeZoneSuffix: true }
): string {
    try {
        const date = new Date(serverTimestamp);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format provided');
        }

        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: options.timeZone
        });

        const formattedDate = formatter.format(date);
        const formattedWithTimeZone = options.includeTimeZoneSuffix
            ? `${formattedDate} (${options.timeZone})`
            : formattedDate;

        return formattedWithTimeZone;
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return 'Invalid date';
    }
}

// Example usage:
console.log(formatTimestamp("2024-04-10T11:40:32Z"));