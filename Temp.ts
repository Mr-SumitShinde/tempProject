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