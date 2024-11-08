import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, only needs to be imported once
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

interface ValpreReactDataTableProps {
    url: string;
}

const ValpreReactDataTable: React.FC<ValpreReactDataTableProps> = ({ url }) => {
    const gridRef = useRef<GridApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => {
        gridRef.current = params.api;  
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
                    console.error('Error fetching data: ', error);
                    params.failCallback();
                });
        }
    });

    useEffect(() => {
        if (gridRef.current && url) {
            const newDataSource = createDataSource(url);
            gridRef.current.setServerSideDatasource(newDataSource);
        }
    }, [url]);

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                ref={gridRef}
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