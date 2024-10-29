Here’s the updated documentation with the package name @barclays/valpre-react-data-table.


---

@barclays/valpre-react-data-table Documentation

The @barclays/valpre-react-data-table is a reusable data table component built using ag-Grid, designed to fetch data from a server-side endpoint. It provides customizable options for pagination, error handling, and dynamic column definitions.

Installation

To use @barclays/valpre-react-data-table, install it via npm or yarn:

npm install @barclays/valpre-react-data-table

or

yarn add @barclays/valpre-react-data-table

Basic Usage

import React from 'react';
import ValpreReactDataTable from '@barclays/valpre-react-data-table';
import '@barclays/valpre-react-data-table/valpre-grid-theme-barclays.scss';

const MyComponent = () => {
  return (
    <ValpreReactDataTable
      url="https://api.example.com/data"
      columnDefs={[
        { field: 'name', headerName: 'Name' },
        { field: 'age', headerName: 'Age' },
      ]}
      pagination={true}
      pageSize={50}
      cacheBlockSize={100}
      maxBlocksInCache={10}
      loadingComponent={<div>Loading...</div>}
      onError={(error) => console.error('Data fetch error:', error)}
    />
  );
};

export default MyComponent;

Props

Required Props

url: string
The base URL for the API endpoint from which data will be fetched.

columnDefs: ColDef[] | ColGroupDef<any>[]
Defines the columns for the data table. Supports both simple and grouped column definitions.


Optional Props

cacheBlockSize: number (default: 100)
Controls the number of rows requested per server-side block.

maxBlocksInCache: number (default: 10)
Determines the maximum number of data blocks retained in the cache.

pagination: boolean (default: false)
Enables or disables pagination.

pageSize: number (default: 100)
Sets the number of rows displayed per page when pagination is enabled.

loadingComponent: JSX.Element
Custom loading component shown when data is being fetched.

onError: (error: Error) => void
Callback function for handling errors during data fetching.


Other Props

Additional props can be passed and will be spread onto the root AgGridReact component.

Example Configurations

Simple Table with Default Pagination

<ValpreReactDataTable
  url="https://api.example.com/data"
  columnDefs={[
    { field: 'id', headerName: 'ID' },
    { field: 'status', headerName: 'Status' },
  ]}
  pagination={true}
/>

Table with Custom Loading and Error Handling

<ValpreReactDataTable
  url="https://api.example.com/data"
  columnDefs={[
    { field: 'product', headerName: 'Product' },
    { field: 'price', headerName: 'Price' },
  ]}
  loadingComponent={<div>Loading data...</div>}
  onError={(error) => alert('Error loading data: ' + error.message)}
/>

Advanced Usage

Column Definitions

Define the columns using an array of ColDef or ColGroupDef objects. Each column definition supports options like field, headerName, and custom properties.

Example:

const columnDefs = [
  { field: 'firstName', headerName: 'First Name', sortable: true },
  { field: 'lastName', headerName: 'Last Name', filter: 'agTextColumnFilter' },
  { field: 'email', headerName: 'Email', resizable: true },
];

Server-Side Sorting and Filtering

Server-side sorting and filtering are supported. ValpreReactDataTable will automatically pass the sortModel and filterModel in the API requests, allowing for dynamic sorting and filtering from the server.


---

This documentation should guide you through integrating @barclays/valpre-react-data-table into your projects smoothly. Let me know if you'd like additional details or examples!

