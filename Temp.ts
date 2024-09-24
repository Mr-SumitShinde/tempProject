import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataTableProps {
  columnDefs: ColDef[];                   // Column definitions
  fetchRows: (request: any) => Promise<{ rows: any[]; totalRowCount: number }>; // Server-side data fetching function
  cacheBlockSize?: number;                // Number of rows per block
  maxBlocksInCache?: number;              // Max number of cached blocks
  pagination?: boolean;                   // Enable/disable pagination (optional)
  pageSize?: number;                      // Page size when pagination is enabled
  loadingComponent?: JSX.Element;         // Custom loading indicator component
  onError?: (error: Error) => void;       // Custom error handling
  [key: string]: any;                     // Any additional grid props
}

const DataTable: React.FC<DataTableProps> = ({
  columnDefs,
  fetchRows,
  cacheBlockSize = 100,
  maxBlocksInCache = 10,
  pagination = false,
  pageSize = 100,
  loadingComponent,
  onError,
  ...gridProps
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onGridReady = (params: any) => {
    const dataSource: IServerSideDatasource = {
      getRows: async (params: IServerSideGetRowsParams) => {
        setLoading(true);
        setError(null);

        try {
          const data = await fetchRows(params.request);
          params.successCallback(data.rows, data.totalRowCount);
        } catch (err) {
          const fetchError = err as Error;
          params.failCallback();

          // Trigger custom error handler
          setError(fetchError);
          if (onError) onError(fetchError);
        } finally {
          setLoading(false);
        }
      },
    };

    params.api.setServerSideDatasource(dataSource);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      {loading && loadingComponent ? loadingComponent : null}
      {error && <div className="error-message">An error occurred: {error.message}</div>}

      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowModelType="serverSide"
        cacheBlockSize={cacheBlockSize}
        maxBlocksInCache={maxBlocksInCache}
        pagination={pagination}
        paginationPageSize={pageSize}
        onGridReady={onGridReady}
        {...gridProps}
      />
    </div>
  );
};

export default DataTable;