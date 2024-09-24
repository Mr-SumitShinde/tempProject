import React from 'react';
import { DataTable } from 'valpre-react-data-table';

const App = () => {
  const columnDefs = [
    { field: 'name', sortable: true, filter: true },
    { field: 'age', sortable: true, filter: true },
    { field: 'country', sortable: true, filter: true }
  ];

  // Custom loading component
  const loadingComponent = <div className="loading-spinner">Loading...</div>;

  // Fetch rows function to pass to DataTable
  const fetchRows = async (request: any) => {
    const response = await fetch('/api/get-rows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startRow: request.startRow,
        endRow: request.endRow,
        sortModel: request.sortModel,
        filterModel: request.filterModel,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return {
      rows: data.rows,
      totalRowCount: data.totalRowCount,
    };
  };

  const handleError = (error: Error) => {
    console.error('Error fetching data:', error);
    // Custom error handling logic
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <DataTable
        columnDefs={columnDefs}
        fetchRows={fetchRows}
        cacheBlockSize={100}
        maxBlocksInCache={10}
        pagination={true}
        pageSize={100}
        loadingComponent={loadingComponent}
        onError={handleError}
      />
    </div>
  );
};

export default App;