import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, only needs to be imported once
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const ValpreReactDataTable = ({ url }) => {
    const gridRef = useRef(null);

    // Update the data source when URL changes
    useEffect(() => {
        if (gridRef.current && url) {
            const dataSource = {
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
            };
            gridRef.current.api.setServerSideDatasource(dataSource);
        }
    }, [url]);

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                ref={gridRef}
                onGridReady={(event) => event.api.sizeColumnsToFit()}
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