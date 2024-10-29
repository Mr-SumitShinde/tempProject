Certainly! I'll provide a structured, comprehensive guide on consuming the @barclays/valpre-react-data-table package, covering the setup, basic usage, customization options, and advanced features. Let's get started:


---

@barclays/valpre-react-data-table

A React-based DataTable Component for Server-Side Rendering

This documentation will guide you on consuming the @barclays/valpre-react-data-table package, from installation and basic usage to advanced configurations and customizations.


---

Table of Contents

1. Getting Started

Installation

Basic Setup

Importing the Component



2. Basic Usage

Displaying Simple Data

Passing Data and Columns Configuration

Server-Side Data Loading



3. Customizing Appearance

Applying Themes and Custom Styles

Overriding SCSS Variables

Using Custom Cell Renderers



4. Advanced Features

Sorting and Filtering

Pagination

Row Selection and Actionable Rows

Handling Server-Side Sorting, Filtering, and Pagination



5. Performance Optimization

Lazy Loading Data

Optimizing Column Widths



6. Error Handling and Debugging

Common Errors and Fixes

Debugging Tips





---

1. Getting Started

1.1 Installation

To get started, install the @barclays/valpre-react-data-table package via npm:

npm install @barclays/valpre-react-data-table

or using Yarn:

yarn add @barclays/valpre-react-data-table

1.2 Basic Setup

Ensure that agGridReact is also installed, as @barclays/valpre-react-data-table depends on it for rendering the data grid.

1.3 Importing the Component

Once installed, import the component into your React project:

import ValpreReactDataTable from '@barclays/valpre-react-data-table';


---

2. Basic Usage

2.1 Displaying Simple Data

To display basic data, configure the columnDefs and rowData properties. The component requires column definitions (for headers and properties) and the data rows you want to display.

const columnDefs = [
  { headerName: 'ID', field: 'id' },
  { headerName: 'Name', field: 'name' },
  { headerName: 'Email', field: 'email' },
];

const rowData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

<ValpreReactDataTable columnDefs={columnDefs} rowData={rowData} />

2.2 Server-Side Data Loading

For server-side data loading, set the serverSide prop to true and define the URL for fetching data. Use the dataFetchHandler to manage server requests.

const dataFetchHandler = async (params) => {
  const response = await fetch(`https://api.example.com/data?page=${params.page}&size=${params.size}`);
  const data = await response.json();
  return data;
};

<ValpreReactDataTable columnDefs={columnDefs} dataFetchHandler={dataFetchHandler} serverSide />


---

3. Customizing Appearance

3.1 Applying Themes and Custom Styles

To customize the appearance, import the SCSS stylesheets:

import '@barclays/valpre-react-data-table/dist/valpre-grid-theme-barclays.scss';
import '@barclays/valpre-react-data-table/dist/valpre-react-data-table.module.scss';

3.2 Overriding SCSS Variables

Override specific variables in your project’s SCSS file to align with your brand.

Example:

$primary-color: #1a73e8;
$header-background: #f5f5f5;

@import '@barclays/valpre-react-data-table/dist/valpre-grid-theme-barclays.scss';

3.3 Using Custom Cell Renderers

You can create custom cell renderers for complex cell data. For example, to render a link in a cell:

const columnDefs = [
  {
    headerName: 'Name',
    field: 'name',
    cellRenderer: (params) => <a href={`/profile/${params.data.id}`}>{params.value}</a>,
  },
];


---

4. Advanced Features

4.1 Sorting and Filtering

Enable sorting and filtering by setting sortable and filter on individual columns.

const columnDefs = [
  { headerName: 'ID', field: 'id', sortable: true },
  { headerName: 'Name', field: 'name', filter: true },
];

4.2 Pagination

Use the pagination prop and specify paginationPageSize for client-side pagination:

<ValpreReactDataTable columnDefs={columnDefs} rowData={rowData} pagination paginationPageSize={10} />

4.3 Row Selection and Actionable Rows

Enable row selection by setting the rowSelection property.

<ValpreReactDataTable columnDefs={columnDefs} rowData={rowData} rowSelection="single" />

4.4 Handling Server-Side Sorting, Filtering, and Pagination

Implement server-side handling for sorting, filtering, and pagination by modifying your dataFetchHandler:

const dataFetchHandler = async (params) => {
  const { sortModel, filterModel, startRow, endRow } = params;
  const response = await fetch(`https://api.example.com/data?sort=${sortModel}&filter=${filterModel}&start=${startRow}&end=${endRow}`);
  const data = await response.json();
  return data;
};

<ValpreReactDataTable columnDefs={columnDefs} dataFetchHandler={dataFetchHandler} serverSide />


---

5. Performance Optimization

5.1 Lazy Loading Data

Enable lazy loading by setting the rowModelType to infinite for large datasets:

<ValpreReactDataTable columnDefs={columnDefs} rowData={rowData} rowModelType="infinite" />

5.2 Optimizing Column Widths

Specify column width properties to optimize grid layout:

const columnDefs = [
  { headerName: 'ID', field: 'id', width: 100 },
  { headerName: 'Name', field: 'name', flex: 1 },
];


---

6. Error Handling and Debugging

6.1 Common Errors and Fixes

"Failed to fetch" error: Verify your API endpoint and network availability.

Invalid rowData structure: Ensure rowData matches the fields defined in columnDefs.


6.2 Debugging Tips

Enable debugging by logging params in dataFetchHandler to inspect requests.

const dataFetchHandler = async (params) => {
  console.log('Data fetch params:', params);
  const response = await fetch(`https://api.example.com/data`);
  return await response.json();
};


---

This detailed guide should help users of all experience levels to get started with the @barclays/valpre-react-data-table package, customize it to fit their needs, and optimize its performance. Let me know if you'd like to add more sections or specific examples!

