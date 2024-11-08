import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Theme CSS

interface ValpreReactDataTableProps {
    url: string;
}

const ValpreReactDataTable: React.FC<ValpreReactDataTableProps> = ({ url }) => {

    const onGridReady = (params: GridReadyEvent) => {
        const dataSource = createDataSource(url);
        params.api.setServerSideDatasource(dataSource);
    };

    const createDataSource = (url: string): IServerSideDatasource => ({
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

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
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