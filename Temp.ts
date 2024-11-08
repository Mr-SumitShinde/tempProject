import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, only needs to be imported once
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const ValpreReactDataTable = ({ url }) => {
    const gridRef = useRef(null);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        const dataSource = createDataSource(url);
        params.api.setServerSideDatasource(dataSource);
    };

    // Dynamically create a data source based on the URL
    const createDataSource = (url) => ({
        getRows: (params) => {
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

    // React to URL changes by updating the data source
    useEffect(() => {
        if (gridRef.current && url) {
            const newDataSource = createDataSource(url);
            gridRef.current.setServerSideDatasource(newDataSource);
        }
    }, [url]);

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
                rowModelType="serverSide"
                serverSideStoreType="partial"
                columnDefs={[
                    { field: 'id', sortable: true, filter: true },
                    { field: 'name', sortable: true, filter: true }
                ]}
            />
        </div>
    );
};

export default ValpreReactDataTable;