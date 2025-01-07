import React from 'react';
import { ServerSideDataTable } from './ServerSideDataTable';
import { ClientSideDataTable } from './ClientSideDataTable';
import { ValpreReactDataTableProps } from './interfaces';

export function ValpreReactDataTable<T>(props: ValpreReactDataTableProps<T>) {
  const { renderMode, ...rest } = props;

  if (renderMode === 'SSR') {
    return <ServerSideDataTable {...rest} />;
  }

  return <ClientSideDataTable {...rest} />;
}