import React, { useState, useEffect } from 'react';
import { useFetchData } from './useFetchData';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Pagination } from './Pagination';
import { Box, Loading, Alert, Type } from '@barclays/blueprint-react';

interface Header<T> {
  title: string;
  datakey: keyof T;
  alignment?: 'left' | 'center' | 'right';
  render?: (item: T) => JSX.Element;
  sortable?: boolean; // Indicates if the column supports sorting
}

interface ValpreReactDataTableProps<T> {
  baseUrl: string;
  createQueryParams: (
    page: number,
    offset: number,
    sortKey?: string,
    sortDirection?: 'asc' | 'desc'
  ) => string;
  headers: Header<T>[];
  pageSize?: number;
  defaultSortKey?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  extractDataFromResponse: (response: any) => T[];
  extractTotalRecordsFromResponse: (response: any) => number;
  extractTimeFromResponse?: (response: any) => string;
  onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
}

export function ValpreReactDataTable<T extends object>({
  baseUrl,
  createQueryParams,
  headers,
  pageSize = 25,
  defaultSortKey,
  defaultSortDirection = 'asc',
  extractDataFromResponse,
  extractTotalRecordsFromResponse,
  extractTimeFromResponse,
  onSortChange,
}: ValpreReactDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    totalCount,
    time,
    error,
    isLoading,
    fetchData,
    sortKey,
    sortDirection,
    updateSorting,
  } = useFetchData<T>({
    baseUrl,
    createQueryParams: (page, offset) => createQueryParams(page, offset, sortKey, sortDirection),
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse,
  });

  // Fetch data whenever the current page, sortKey, or sortDirection changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, sortKey, sortDirection]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle sorting logic triggered by TableHeader
  const handleSortChange = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    updateSorting(key, newDirection);

    // Notify parent if needed
    if (onSortChange) {
      onSortChange(key, newDirection);
    }
  };

  // Handle pagination
  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <Box centered>
        <Loading />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert variant="error" head={<Type size="md" weight="medium">Failed to Load Data</Type>}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <table>
        {/* Table Header with Sorting */}
        <TableHeader
          headers={headers}
          onSortChange={handleSortChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />

        {/* Table Body */}
        <TableBody data={data} headers={headers} />

        {/* Footer with Pagination */}
        {totalCount > 0 && (
          <Box style={{ paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Type>
              {`Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(
                currentPage * pageSize,
                totalCount
              )} of ${totalCount} records${time ? ` as of ${time}` : ''}`}
            </Type>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </Box>
        )}
      </table>
    </Box>
  );
}



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