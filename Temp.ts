/**
 * Formats the given date into a readable string.
 * @param {Date} inputDate - The date to format. Defaults to the current date if not provided.
 * @returns {string} - Formatted date and time string.
 */
export const formattedDate = (inputDate?: Date): string => {
  const currentDate = inputDate || new Date();

  const date = currentDate.toLocaleDateString();

  const time = currentDate.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  });

  const timeSplit = time.split(/(?=GMT)/g);

  return `${date} at ${timeSplit[0].trim()} (${timeSplit[1].trim()})`;
};