import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Theme CSS

interface ValpreReactDataTableProps {
    url: string;
}

const ValpreReactDataTable: React.FC<ValpreReactDataTableProps> = ({ url }) => {
    // Generate a unique key based on the URL
    const key = url;

    const createDataSource = (): IServerSideDatasource => ({
        getRows: (params: IServerSideGetRowsParams) => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        params.successCallback(data.rows, data.lastRow);
                    } else {
                        params.failCallback();
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    params.failCallback();
                });
        }
    });

    // The component rerenders every time the key changes, which is every time the URL changes
    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                key={key} // Using URL as a key to force reinitialization
                onGridReady={params => params.api.setServerSideDatasource(createDataSource())}
                rowModelType="serverSide"
                serverSideStoreType="partial"
                columnDefs={[
                    { field: 'id', headerName: 'ID', sortable: true, filter: true },
                    { field: 'name', headerName: 'Name', sortable: true, filter: true }
                ]}
            />
        </div>
    );
};

export default ValpreReactDataTable;