import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyDataTable = () => {
  const gridOptions = useMemo(() => ({
    rowModelType: 'serverSide',
    pagination: true,
    cacheBlockSize: 100,
    serverSideDatasource: (params) => {
      const request = params.request;
      const { startRow, endRow, sortModel, filterModel } = request;
      
      // Extract sorting and filtering info
      const sortField = sortModel[0]?.colId || 'id';
      const sortDirection = sortModel[0]?.sort || 'asc';

      const filters = {};
      Object.keys(filterModel).forEach(field => {
        filters[field] = filterModel[field].filter;
      });

      // Send request to mock API (JSON-based)
      fetch(`/api/data?startRow=${startRow}&endRow=${endRow}&sort_by=${sortField}&order=${sortDirection}&filters=${JSON.stringify(filters)}`)
        .then(response => response.json())
        .then(data => {
          params.successCallback(data.rows, data.totalRows);
        })
        .catch(error => {
          params.failCallback();
        });
    }
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        gridOptions={gridOptions}
        columnDefs={[
          { field: 'id', sortable: true, filter: true },
          { field: 'name', sortable: true, filter: true },
          { field: 'category', sortable: true, filter: true },
          { field: 'price', sortable: true, filter: true }
        ]}
      />
    </div>
  );
};

export default MyDataTable;