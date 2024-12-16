const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey as string | undefined);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(defaultSortDirection);



const fetchData = async (page: number) => {
  const queryParams = createQueryParams(page, pageSize, sortKey, sortDirection);
  const url = baseUrl.includes('?') ? `${baseUrl}&${queryParams}` : `${baseUrl}?${queryParams}`;
  ...
};



export const TableHeader = <T,>({
  headers,
  onSortChange,
  sortKey,
  sortDirection,
}: {
  headers: Array<{ title: string; datakey: keyof T; alignment?: 'left' | 'center' | 'right'; sortable?: boolean }>;
  onSortChange: (key: string) => void;
  sortKey: string | undefined;
  sortDirection: 'asc' | 'desc' | undefined;
}) => (
  <thead>
    <tr>
      {headers.map((header, index) => (
        <th
          key={index}
          style={{ textAlign: header.alignment || 'left', cursor: header.sortable ? 'pointer' : 'default' }}
          onClick={() => header.sortable && onSortChange(header.datakey as string)}
        >
          {header.title}
          {header.sortable && sortKey === header.datakey && (
            <span style={{ marginLeft: '5px' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </th>
      ))}
    </tr>
  </thead>
);



const handleSortChange = (key: string) => {
  const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
  setSortKey(key);
  setSortDirection(newDirection);

  // Notify parent component if needed
  if (onSortChange) {
    onSortChange(key, newDirection);
  }

  // Fetch data with updated sorting
  fetchData(currentPage);
};



<TableHeader
  headers={headers}
  onSortChange={handleSortChange}
  sortKey={sortKey}
  sortDirection={sortDirection}
/>




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
  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey as string | undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(defaultSortDirection);

  const {
    data,
    totalCount,
    time,
    error,
    isLoading,
    fetchData,
  } = useFetchData<T>(
    baseUrl,
    (page, offset) => createQueryParams(page, offset, sortKey, sortDirection),
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse
  );

  // Fetch data on currentPage or sortKey/sortDirection change
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, sortKey, sortDirection]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Sorting Handler
  const handleSortChange = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);

    // Notify parent component
    if (onSortChange) {
      onSortChange(key, newDirection);
    }
  };

  // Pagination Handler
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

        {/* Footer */}
        {totalCount > 0 && (
          <Box style={{ paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Type>{`Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} records${
              time ? ` as of ${time}` : ''
            }`}</Type>
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
  createQueryParams: (page: number, offset: number, sortKey?: string, sortDirection?: 'asc' | 'desc') => string;
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

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      const offset = pageSize;
      const queryParams = createQueryParams(page, offset);
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
    [baseUrl, createQueryParams, pageSize, extractDataFromResponse, extractTotalRecordsFromResponse, extractTimeFromResponse]
  );

  return { data, totalCount, time, error, isLoading, fetchData };
}