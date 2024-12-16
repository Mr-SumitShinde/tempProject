import { useState, useCallback } from 'react';
import { valpreAPIGet } from '@barclays/valpre-api-services';

interface FetchDataOptions<T> {
  baseUrl: string;
  createQueryParams: (
    page: number,
    offset: number,
    sortKey?: string,
    sortDirection?: 'asc' | 'desc',
    searchQuery?: string
  ) => string;
  pageSize: number;
  extractDataFromResponse: (response: any) => T[];
  extractTotalRecordsFromResponse: (response: any) => number;
  extractTimeFromResponse?: (response: any) => string;
}

export function useFetchData<T>({
  baseUrl,
  createQueryParams,
  pageSize,
  extractDataFromResponse,
  extractTotalRecordsFromResponse,
  extractTimeFromResponse,
}: FetchDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      const offset = pageSize;
      const queryParams = createQueryParams(page, offset, sortKey, sortDirection, searchQuery);
      const url = baseUrl.includes('?') ? `${baseUrl}&${queryParams}` : `${baseUrl}?${queryParams}`;

      try {
        const response = await valpreAPIGet(url);

        setData(extractDataFromResponse(response));
        setTotalCount(extractTotalRecordsFromResponse(response));
        if (extractTimeFromResponse) {
          setTime(extractTimeFromResponse(response));
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, createQueryParams, pageSize, sortKey, sortDirection, searchQuery, extractDataFromResponse, extractTotalRecordsFromResponse, extractTimeFromResponse]
  );

  return { data, totalCount, time, error, isLoading, fetchData, sortKey, sortDirection, searchQuery, setSearchQuery, setSortKey, setSortDirection };
}