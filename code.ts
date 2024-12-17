Here’s the updated ValpreReactDataTable main file that integrates the SmartSearch component as a separate reusable component.


---

Updated ValpreReactDataTable.tsx

import React, { useState, useEffect } from 'react';
import { useFetchData } from './useFetchData';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Pagination } from './Pagination';
import { Box, Loading, Alert, Type } from '@barclays/blueprint-react';
import { SmartSearch } from './SmartSearch';
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
  showSearch = true, // New prop to toggle SmartSearch visibility
}: ValpreReactDataTableProps<T> & { showSearch?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

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
    setSearchQuery,
  } = useFetchData<T>({
    baseUrl,
    createQueryParams: (page, offset) =>
      createQueryParams(page, offset, sortKey, sortDirection, searchInput),
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse,
    defaultSortKey,
    defaultSortDirection,
  });

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, sortKey, sortDirection, searchInput]);

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

  return (
    <Box>
      {showSearch && (
        <SmartSearch
          value={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            setCurrentPage(1);
          }}
          placeholder="Search..."
          debounceDelay={500}
        />
      )}
      {isLoading ? (
        <Box centered>
          <Loading />
        </Box>
      ) : error ? (
        <Alert variant="error" head={<Type size="md" weight="medium">Failed to Load Data</Type>}>
          {error}
        </Alert>
      ) : (
        <>
          <table>
            <TableHeader
              headers={headers}
              onSortChange={handleSortChange}
              sortKey={sortKey}
              sortDirection={sortDirection}
            />
            <TableBody data={data} headers={headers} />
          </table>
          {totalCount > 0 && (
            <Box style

