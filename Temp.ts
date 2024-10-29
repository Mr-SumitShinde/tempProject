The warning you’re seeing is due to the ref passed to a function component (AgGridReact), which does not support refs directly unless it's wrapped with React.forwardRef. To address this, we need to modify ValpreReactDataTable to use React.forwardRef when creating the ref for AgGridReact.

Here's how to adjust ValpreReactDataTable to use React.forwardRef:

Step 1: Modify the Component with React.forwardRef

import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import {
  IServerSideDatasource,
  ColDef,
  ModuleRegistry,
  IServerSideGetRowsParams,
  ColGroupDef,
} from '@ag-grid-community/core';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import '/valpre-grid-theme-barclays.scss';

interface DataTableProps {
  url: string;
  columnDefs: ColDef[] | ColGroupDef<any>[];
  cacheBlockSize?: number;
  maxBlocksInCache?: number;
  pagination?: boolean;
  pageSize?: number;
  loadingComponent?: JSX.Element;
  onError?: (error: Error) => void;
  [key: string]: any;
}

const overlayNoRowsTemplate = 'No rows to display!';

ModuleRegistry.registerModules([ServerSideRowModelModule as any]);

const ValpreReactDataTable = forwardRef<AgGridReact, DataTableProps>(({
  url,
  columnDefs,
  cacheBlockSize = 100,
  maxBlocksInCache = 10,
  pagination = false,
  pageSize = 100,
  loadingComponent,
  onError,
  ...gridProps
}, ref) => {
  const gridRef = useRef<AgGridReact>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useImperativeHandle(ref, () => gridRef.current as AgGridReact);

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
  }), []);

  const onGridReady = (params: any) => {
    const dataSource: IServerSideDatasource = {
      getRows: async (params: IServerSideGetRowsParams) => {
        setLoading(true);
        setError(null);

        try {
          const { startRow, endRow, sortModel, filterModel } = params.request;
          const sortField = sortModel[0]?.colId || 'id';
          const sortDirection = sortModel[0]?.sort || 'asc';
          const filters: any = {};

          if (filterModel != null) {
            Object.keys(filterModel).forEach((field) => {
              filters[field] = (filterModel as any)[field].filter;
            });
          }

          const response = await fetch(
            `${url}/api/data?startRow=${startRow}&endRow=${endRow}&sort_by=${sortField}&order=${sortDirection}&filters=${JSON.stringify(filters)}`
          );
          const data = await response.json();

          const rowCount = data.totalRowCount !== undefined ? data.totalRowCount : -1;
          params.success({ rowData: data.rows, rowCount });
        } catch (err) {
          const fetchError = err as Error;
          params.fail();
          setError(fetchError);
          onError && onError(fetchError);
        } finally {
          setLoading(false);
        }
      },
    };

    params.api.setServerSideDatasource(dataSource);
  };

  return (
    <div>
      {loading && loadingComponent}
      {error && <div className="error-message">An error occurred: {error.message}</div>}
      <div style={containerStyle}>
        <div style={gridStyle}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            ref={gridRef}
            domLayout="autoHeight"
            className="valpre-grid-theme-barclays"
            rowModelType="serverSide"
            overlayNoRowsTemplate={overlayNoRowsTemplate}
            cacheBlockSize={cacheBlockSize}
            maxBlocksInCache={maxBlocksInCache}
            pagination={pagination}
            paginationPageSize={pageSize}
            suppressScrollOnNewData={true}
            suppressColumnVirtualisation={true}
            onGridReady={onGridReady}
            {...gridProps}
          />
        </div>
      </div>
    </div>
  );
});

export default ValpreReactDataTable;

Explanation

React.forwardRef: Wraps ValpreReactDataTable so it can accept a ref from a parent component.

useImperativeHandle: Exposes gridRef as the component's ref, allowing parent components to access AgGridReact methods through ValpreReactDataTable.


Usage in Tests

No changes are required in the tests to use the forwardRef version of the component. This change should remove the ref-related warning, as now ValpreReactDataTable is wrapped with forwardRef and allows gridRef to be used without warnings.

