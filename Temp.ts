import React, { useState, useEffect } from 'react';
import { useFetchData } from './useFetchData';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Pagination } from './Pagination';
import { Box, Loading, Alert, Type } from '@barclays/blueprint-react';

export function ValpreReactDataTable<T extends object>({
  baseUrl,
  createQueryParams,
  headers,
  pageSize = 25,
  extractDataFromResponse,
  extractTotalRecordsFromResponse,
  extractTimeFromResponse,
}: any) {
  const { data, totalCount, time, error, isLoading, fetchData } = useFetchData(
    baseUrl,
    createQueryParams,
    pageSize,
    extractDataFromResponse,
    extractTotalRecordsFromResponse,
    extractTimeFromResponse
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading)
    return (
      <Box centered>
        <Loading />
      </Box>
    );

  if (error)
    return (
      <Alert variant="error" head={<Type>Failed to load data</Type>}>
        {error}
      </Alert>
    );

  return (
    <Box>
      <table>
        <TableHeader headers={headers} />
        <TableBody data={data} headers={headers} />
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <Type>{`Showing ${data.length} of ${totalCount} records ${time ? `as of ${time}` : ''}`}</Type>
    </Box>
  );
}