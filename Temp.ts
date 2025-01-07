Documentation for ValpreReactDataTable (Version 2)

The ValpreReactDataTable is a reusable, type-safe React table component supporting both Server-Side Rendering (SSR) and Client-Side Rendering (CSR). This version separates SSR and CSR logic into distinct props and components, ensuring a clean and maintainable structure.


---

Features

1. Dynamic Render Modes: Supports both SSR and CSR through the renderMode prop.


2. Type Safety: Utilizes generics (T) to enforce type safety for headers, data, and sorting keys.


3. Custom Rendering: Allows custom cell rendering for specific columns using the render function.


4. Pagination: Handles pagination for both SSR and CSR.


5. Sorting: Provides sortable columns with ascending and descending order toggling.


6. Search: Supports filtering in CSR mode.




---

Installation

npm install valpre-react-data-table


---

Usage

1. Import the Component

import { ValpreReactDataTable } from 'valpre-react-data-table';


---

Props

Common Props


---

CSR-Specific Props


---

SSR-Specific Props


---

Header Interface

export interface Header<T> {
  title: string; // The display title of the column
  datakey: keyof T; // The key corresponding to the column in the data object
  alignment?: 'left' | 'center' | 'right'; // The text alignment for the column (default: 'left')
  render?: (item: T) => JSX.Element; // Custom render function for the column
  sortable?: boolean; // Whether the column is sortable (default: false)
}


---

Examples

1. Client-Side Rendering Example

<ValpreReactDataTable
  renderMode="CSR"
  headers={[
    { title: 'Name', datakey: 'name', sortable: true },
    { title: 'Age', datakey: 'age', sortable: true, alignment: 'right' },
    {
      title: 'Actions',
      datakey: 'actions',
      render: (item) => <button onClick={() => alert(`Edit ${item.name}`)}>Edit</button>,
    },
  ]}
  data={[
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
  ]}
  pageSize={5}
  showSearch
  defaultSortKey="name"
  defaultSortDirection="asc"
/>


---

2. Server-Side Rendering Example

<ValpreReactDataTable
  renderMode="SSR"
  headers={[
    { title: 'Name', datakey: 'name', sortable: true },
    { title: 'Age', datakey: 'age', sortable: true, alignment: 'center' },
  ]}
  baseUrl="https://api.example.com/data"
  createQueryParams={(page, offset, sortKey, sortDirection, searchQuery) =>
    `page=${page}&offset=${offset}&sortKey=${sortKey}&sortDirection=${sortDirection}&search=${searchQuery}`
  }
  extractDataFromResponse={(response) => response.data}
  extractTotalRecordsFromResponse={(response) => response.totalCount}
  pageSize={10}
  showSearch
/>


---

Features by Render Mode

Client-Side Rendering

Handles filtering, sorting, and pagination on the client.

Useful for smaller datasets where the entire dataset can be loaded into memory.


Server-Side Rendering

Fetches data, performs filtering, sorting, and pagination on the server.

Useful for large datasets or when data must stay on the server.



---

Styling

Add custom styles to the table using the className prop for the wrapper or style prop for individual elements.

Example:

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  cursor: pointer;
}



---

Planned Enhancements

Hybrid Mode: Combine SSR for initial load and CSR for subsequent actions.

Infinite Scrolling: Replace pagination with infinite scroll for large datasets.

Row Selection: Add support for row selection and bulk actions.

Export: Support exporting table data to CSV or Excel.



---

This documentation covers all features of the ValpreReactDataTable version 2 and explains how to use it effectively. Let me know if you'd like further additions or refinements!

