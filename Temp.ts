import React from 'react';
import { ValpreReactDataTableProps } from './interfaces';

export function ClientSideDataTable<T>({
  headers,
  showSearch,
  pageSize = 10,
  data: initialData,
}: Omit<ValpreReactDataTableProps<T>, 'renderMode' | 'baseUrl' | 'createQueryParams' | 'extractDataFromResponse' | 'extractTotalRecordsFromResponse' | 'extractTimeFromResponse'> & { data: T[] }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initialData.map((row, index) => (
            <tr key={index}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{row[header.datakey]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


import React from 'react';
import { ServerSideDataTable } from './ServerSideDataTable';
import { ClientSideDataTable } from './ClientSideDataTable';
import { ValpreReactDataTableProps } from './interfaces';

export function ValpreReactDataTable<T>({
  renderMode,
  ...rest
}: ValpreReactDataTableProps<T>) {
  if (renderMode === 'CSR') {
    if (!rest.data) {
      throw new Error('Data is required for client-side rendering (CSR).');
    }
    return <ClientSideDataTable {...rest} data={rest.data} />;
  }

  return <ServerSideDataTable {...rest} />;
}

import React from 'react';
import { ValpreReactDataTableProps } from './interfaces';

export function ServerSideDataTable<T>({
  headers,
  baseUrl,
  createQueryParams,
  pageSize = 10,
  extractDataFromResponse,
  extractTotalRecordsFromResponse,
  extractTimeFromResponse,
  showSearch,
  defaultSortKey,
  defaultSortDirection,
}: Omit<
  ValpreReactDataTableProps<T>,
  'renderMode' | 'data'
>) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Server-side rendering logic will populate rows */}
          <tr>
            <td colSpan={headers.length}>Data fetched from server</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}