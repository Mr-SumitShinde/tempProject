Here’s a more detailed documentation guide for consuming the @barclays/valpre-react-data-table package. This will provide a comprehensive overview of installation, props, and usage scenarios, as well as example configurations for common use cases.


---

@barclays/valpre-react-data-table Documentation

The @barclays/valpre-react-data-table is a React-based data table component built on ag-Grid for advanced server-side rendering. It provides a configurable and customizable grid with support for server-side data fetching, pagination, sorting, and filtering, optimized for enterprise use.

Installation

Install the package via npm or yarn:

npm install @barclays/valpre-react-data-table

or

yarn add @barclays/valpre-react-data-table

Ensure you also import the custom Barclays theme stylesheet for consistent styling:

import '@barclays/valpre-react-data-table/dist/valpre-grid-theme-barclays.css';

Basic Usage

import React from 'react';
import ValpreReactDataTable from '@barclays/valpre-react-data-table';

const App = () => {
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

export default App;

Props

Required Props

url: string
Base URL of the API endpoint for data fetching. This URL should return JSON data formatted for server-side processing with startRow, endRow, and other query parameters.

columnDefs: ColDef[] | ColGroupDef<any>[]
Array of column definitions for the grid. Supports both simple and grouped columns to define the structure and configuration of each column.


Optional Props

cacheBlockSize: number (default: 100)
Defines the number of rows fetched in each request block. Used for server-side pagination and affects performance based on data volume.

maxBlocksInCache: number (default: 10)
Specifies the maximum number of blocks to cache. Useful for controlling memory usage in large data sets.

pagination: boolean (default: false)
Enables or disables client-side pagination.

pageSize: number (default: 100)
Sets the number of rows displayed per page if pagination is enabled.

loadingComponent: JSX.Element
Custom component displayed when data is loading, useful for showing spinners or progress indicators.

onError: (error: Error) => void
Callback function triggered when an error occurs during data fetching. Allows custom error handling logic.

overlayNoRowsTemplate: string
Template string displayed when no rows are available. Defaults to 'No rows to display!'.


Additional Props

Other props passed to ValpreReactDataTable will be spread onto the root AgGridReact component. This allows for more advanced customization through ag-Grid’s standard API.

Data Handling

The component uses server-side row model fetching. Requests sent to the url include parameters like:

startRow and endRow for pagination,

sort_by and order for sorting, and

filters for custom filters in JSON format.


The endpoint should respond with a JSON object containing:

rows: an array of rows for the requested page,

totalRowCount: total number of rows in the dataset, if available.


Examples

Basic Table with Pagination

<ValpreReactDataTable
  url="https://api.example.com/data"
  columnDefs={[
    { field: 'productName', headerName: 'Product Name' },
    { field: 'price', headerName: 'Price' },
  ]}
  pagination={true}
  pageSize={20}
/>

Custom Loading and Error Handling

<ValpreReactDataTable
  url="https://api.example.com/data"
  columnDefs={[
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
  ]}
  loadingComponent={<div>Loading, please wait...</div>}
  onError={(error) => {
    console.error('Error fetching data:', error);
    alert('Failed to load data.');
  }}
/>

Advanced Usage with Server-Side Sorting and Filtering

Server-side sorting and filtering are automatically handled by ValpreReactDataTable through ag-Grid. Sorting and filtering settings from the UI are passed as query parameters to the server-side endpoint.

<ValpreReactDataTable
  url="https://api.example.com/advanced-data"
  columnDefs={[
    { field: 'id', headerName: 'ID', sortable: true },
    { field: 'status', headerName: 'Status', filter: 'agTextColumnFilter' },
    { field: 'lastUpdated', headerName: 'Last Updated', sortable: true },
  ]}
  cacheBlockSize={50}
  maxBlocksInCache={5}
/>

Column Definitions

Define columns by specifying an array of ColDef or ColGroupDef objects. Each column can include properties such as:

field: Field name from the data source.

headerName: Display name for the column.

sortable: Allows sorting on this column.

filter: Specifies filter type (e.g., 'agTextColumnFilter', 'agNumberColumnFilter').

resizable: Allows resizing the column.


Example:

const columnDefs = [
  { field: 'name', headerName: 'Name', sortable: true },
  { field: 'age', headerName: 'Age', filter: 'agNumberColumnFilter' },
  { field: 'location', headerName: 'Location', resizable: true },
];

Tips for Optimal Performance

1. Cache Size: Adjust cacheBlockSize and maxBlocksInCache based on data size and frequency of user navigation to optimize performance.


2. Custom Loading: Use a simple and lightweight loading component to improve perceived performance.


3. Error Handling: Customize onError to gracefully handle and log API issues.


4. Column Optimization: Enable only necessary features (e.g., sorting, filtering) to improve rendering speed.



FAQ

How does ValpreReactDataTable handle pagination?

Pagination can be enabled by setting pagination={true}. This will display a page with a set number of rows, controlled by the pageSize prop.

What happens if data fetching fails?

If an error occurs during data fetching, ValpreReactDataTable will trigger the onError callback with the error object. Additionally, a default error message will be displayed if no custom error handling is provided.

How do I customize the appearance of the data table?

To apply a custom theme, import the valpre-grid-theme-barclays.css style file or customize ag-Grid themes directly using CSS.


---

This documentation provides a structured overview for using @barclays/valpre-react-data-table. Let me know if you need any further details or additional examples!

