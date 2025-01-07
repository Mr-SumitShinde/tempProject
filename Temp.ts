import React from 'react';
import { ServerSideDataTable } from './ServerSideDataTable';
import { ClientSideDataTable } from './ClientSideDataTable';
import { ValpreReactDataTableProps } from './interfaces';

export function ValpreReactDataTable<T>({
  renderMode,
  data,
  ...rest
}: ValpreReactDataTableProps<T>) {
  if (renderMode === 'CSR') {
    if (!data) {
      throw new Error('Data is required for client-side rendering (CSR).');
    }
    return <ClientSideDataTable data={data} {...rest} />;
  }
  return <ServerSideDataTable {...rest} />;
}