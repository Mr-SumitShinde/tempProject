import React from 'react';
import { ServerSideDataTable } from './ServerSideDataTable';
import { ClientSideDataTable } from './ClientSideDataTable';
import { ValpreReactDataTableProps } from './interfaces';

export function ValpreReactDataTable<T extends object>(
  props: ValpreReactDataTableProps<T>
) {
  if (props.renderMode === 'CSR') {
    const { renderMode, ...rest } = props;
    return <ClientSideDataTable<T> {...rest} />;
  }

  if (props.renderMode === 'SSR') {
    const { renderMode, ...rest } = props;
    return <ServerSideDataTable<T> {...rest} />;
  }

  return null;
}