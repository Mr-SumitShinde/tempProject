import React, { useState, useEffect } from 'react';
import { TableBody } from './components/TableBody/TableBody';
import { TableColumnHeader } from './components/TableColumnHeader/TableColumnHeader';
import { Pagination } from './components/TablePagination/TablePagination';
import { SmartSearch } from './components/SmartSearch/SmartSearch';
import { Box, Loading, Alert, Type, Table, Icon } from '@barclays/blueprint-react';
import { useFetchData } from './api-hook/useFetchData/UseFetchData';
import { useDebounce } from './helper/useDebounce';
import { ValpreReactDataTableProps } from './interfaces';

export function ValpreReactDataTable<T extends object>({
  renderMode = 'SSR', // Default to SSR
  baseUrl,
  createQueryParams,
  headers,
  showSearch = false,
  pageSize = 25,
  defaultSortKey,
  defaultSortDirection = 'asc',
  extractDataFromResponse,
  extractTotalRecordsFromResponse,
  extractTimeFromResponse,
  onSortChange,
  data: initialData = [], // For CSR, user can pass pre-fetched data
}: ValpreReactDataTableProps<T> & { renderMode?: 'SSR' | 'CSR'; data?: T[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 900);
  const [localData, setLocalData] = useState<T[]>([]); // Local data for CSR
  const [filteredData, setFilteredData] = useState<T[]>([]); // Filtered data for CSR
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  // SSR Data Fetching
  const {
    data: serverData,
    totalCount,
    time,
    error,
    isLoading,
    fetchData,
    setSearchQuery,
    updateSorting,
  } = useFetchData<T>({
    baseUrl,
    createQueryParams,
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse,
    defaultSortKey,
    defaultSortDirection,
  });

  useEffect(() => {
    if (renderMode === 'SSR') {
      setSearchQuery(debouncedSearchQuery);
      setCurrentPage(1);
    } else if (renderMode === 'CSR') {
      // Filter data locally
      const filtered = initialData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (renderMode === 'SSR') {
      fetchData(currentPage);
    }
  }, [currentPage, sortKey, sortDirection, debouncedSearchQuery]);

  useEffect(() => {
    if (renderMode === 'CSR' && initialData) {
      setLocalData(initialData);
      setFilteredData(initialData);
    }
  }, [initialData]);

  const handleSortChange = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);

    if (renderMode === 'SSR') {
      updateSorting(key, newDirection);
      if (onSortChange) onSortChange(key, newDirection);
    } else if (renderMode === 'CSR') {
      const sorted = [...filteredData].sort((a: any, b: any) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setFilteredData(sorted);
    }
  };

  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil((renderMode === 'SSR' ? totalCount : filteredData.length) / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  if (renderMode === 'SSR' && isLoading) {
    return (
      <Box centered>
        <Loading />
      </Box>
    );
  }

  if (renderMode === 'SSR' && error) {
    return (
      <Alert
        announceOnMount
        head={<Type size="md" weight="medium">Failed to Display Table</Type>}
        media={<Icon aria-label="error icon label" icon="error" size="sm" variant="error" />}
      />
    );
  }

  const displayedData = renderMode === 'SSR' ? serverData : filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      {showSearch && (
        <SmartSearch searchInput={searchInput} setSearchInput={setSearchInput} />
      )}
      <Table headingVariant="secondary">
        <TableColumnHeader
          headers={headers}
          onSortChange={handleSortChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
        <TableBody data={displayedData} headers={headers} />
      </Table>
      {(renderMode === 'SSR' ? totalCount : filteredData.length) > 0 && (
        <div style={{ paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Type>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, renderMode === 'SSR' ? totalCount : filteredData.length)} of{' '}
            {renderMode === 'SSR' ? totalCount : filteredData.length} records
            {time && renderMode === 'SSR' ? ` as of ${time}` : ''}
          </Type>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((renderMode === 'SSR' ? totalCount : filteredData.length) / pageSize)}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}