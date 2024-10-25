import React, { useMemo, useRef, useState } from 'react';
import { ColDef, ModuleRegistry, ColGroupDef, IServerSideDatasource, IServerSideGetRowsParams } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import './valpre-grid-theme-barclays.scss';

interface DataTableProps {
  url: string;
  columnDefs: ColDef[] | ColGroupDef<any>[];
  cacheBlockSize?: number;
  maxBlocksInCache?: number;
  pagination?: boolean;
  pageSize?: number;
  loadingComponent?: JSX.Element;
  onError?: (error: Error) => void;
  renderMode: 'clientSide' | 'serverSide';
  getRowUrl: (data: any) => string;  // Function to generate URL from row data
  [key: string]: any;
}

const overlayNoRowsTemplate = 'No rows to display!';

ModuleRegistry.registerModules([ServerSideRowModelModule as any]);

const ValpreReactDataTable: React.FC<DataTableProps> = ({
  url,
  columnDefs,
  cacheBlockSize = 100,
  maxBlocksInCache = 10,
  pagination = false,
  pageSize = 100,
  loadingComponent,
  onError,
  renderMode,
  getRowUrl,
  ...gridProps
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const defaultColDef = useMemo(() => ({ flex: 1, minWidth: 100 }), []);

  const handleRowClick = (event: any) => {
    const url = getRowUrl(event.data);
    window.location.href = url; // or use history.push(url) if using React Router
  };

  return (
    <div>
      {loading && loadingComponent}
      {error && (
        <div className="error-message">An error occurred: {error.message}</div>
      )}
      <div style={containerStyle}>
        <div style={gridStyle}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            ref={gridRef}
            domLayout="autoHeight"
            className="valpre-grid-theme-barclays"
            rowModelType={renderMode === 'serverSide' ? 'serverSide' : 'clientSide'}
            overlayNoRowsTemplate={overlayNoRowsTemplate}
            cacheBlockSize={cacheBlockSize}
            maxBlocksInCache={maxBlocksInCache}
            pagination={pagination}
            paginationPageSize={pageSize}
            suppressScrollOnNewData={true}
            suppressColumnVirtualisation={true}
            onRowClicked={handleRowClick}
            {...gridProps}
          />
        </div>
      </div>
    </div>
  );
};

export { ValpreReactDataTable };