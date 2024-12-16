import { useState } from 'react';
import { valpreAPIGet } from '@barclays/valpre-api-services';

export function useFetchData<T>(
  baseUrl: string,
  createQueryParams: (page: number, offset: number) => string,
  pageSize: number,
  extractDataFromResponse: (response: any) => T[],
  extractTotalRecordsFromResponse: (response: any) => number,
  extractTimeFromResponse?: (response: any) => string
) {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async (page: number) => {
    setLoading(true);
    setError(null);

    const offset = pageSize;
    const queryParams = createQueryParams(page, offset);
    const url = baseUrl.includes('?') ? `${baseUrl}&${queryParams}` : `${baseUrl}?${queryParams}`;

    try {
      const response = await valpreAPIGet(url);
      setData(extractDataFromResponse(response));
      setTotalCount(extractTotalRecordsFromResponse(response));
      if (extractTimeFromResponse) setTime(extractTimeFromResponse(response));
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { data, totalCount, time, error, isLoading, fetchData };
}