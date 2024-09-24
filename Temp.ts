import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataTableProps {
  columnDefs: ColDef[];        // Column definitions passed from consuming app
  fetchRows: (request: any) => Promise<{ rows: any[]; totalRowCount: number }>; // A function passed to fetch rows from the server
  cacheBlockSize?: number;     // Number of rows per server-side block
  maxBlocksInCache?: number;   // Max number of blocks in cache
  // Additional grid props if needed
  [key: string]: any;
}

const DataTable: React.FC<DataTableProps> = ({
  columnDefs,
  fetchRows,
  cacheBlockSize = 100,
  maxBlocksInCache = 10,
  ...gridProps
}) => {
  const gridRef = useRef<AgGridReact>(null);

  const onGridReady = (params: any) => {
    const dataSource: IServerSideDatasource = {
      getRows: async (params: IServerSideGetRowsParams) => {
        console.log('Requesting rows from', params.request);

        try {
          const data = await fetchRows(params.request);
          params.successCallback(data.rows, data.totalRowCount);
        } catch (error) {
          params.failCallback();
        }
      },
    };

    params.api.setServerSideDatasource(dataSource);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowModelType="serverSide"
        cacheBlockSize={cacheBlockSize}
        maxBlocksInCache={maxBlocksInCache}
        onGridReady={onGridReady}
        {...gridProps}
      />
    </div>
  );
};

export default DataTable;