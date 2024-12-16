import React, { useState, useEffect } from 'react';
import { useFetchData } from './useFetchData';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Pagination } from './Pagination';
import { Box, Loading, Alert, Type, Input } from '@barclays/blueprint-react';
import { ValpreReactDataTableProps } from './interfaces';

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
    searchQuery,
    setSearchQuery,
    updateSorting,
  } = useFetchData<T>({
    baseUrl,
    createQueryParams: (page, offset) => createQueryParams(page, offset, sortKey, sortDirection, searchQuery),
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse,
  });

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, sortKey, sortDirection, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortChange = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    updateSorting(key, newDirection);
    if (onSortChange) {
      onSortChange(key, newDirection);
    }
  };

  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
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
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        style={{ marginBottom: '10px' }}
      />
      <table>
        <TableHeader
          headers={headers}
          onSortChange={handleSortChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
        <TableBody data={data} headers={headers} />
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