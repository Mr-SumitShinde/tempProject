import { formattedDate } from './date-utils';

describe('formattedDate', () => {
  it('should format the current date and time if no input is provided', () => {
    const result = formattedDate();
    expect(result).toContain('at'); // Simple check to ensure the format is correct
  });

  it('should format a given date correctly', () => {
    const testDate = new Date('2024-11-20T10:30:00Z');
    const result = formattedDate(testDate);
    expect(result).toBe('20/11/2024 at 10:30 (GMT)');
  });
});