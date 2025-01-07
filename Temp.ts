Here’s the documentation for the props in a non-tabular form, formatted for README.md:


---

Props

Common Props

1. renderMode (required):
Type: 'CSR' | 'SSR'
Specifies whether the table operates in Client-Side Rendering (CSR) or Server-Side Rendering (SSR) mode.


2. headers (required):
Type: Header<T>[]
Defines the structure of the table columns, including their title, alignment, sortability, and rendering behavior.


3. showSearch (optional):
Type: boolean
Whether to display the search bar. Default is false.


4. pageSize (optional):
Type: number
Number of rows displayed per page. Default is 10.


5. defaultSortKey (optional):
Type: keyof T
The key of the column to sort by, initially.


6. defaultSortDirection (optional):
Type: 'asc' | 'desc'
The initial sorting direction. Default is 'asc'.


7. onSortChange (optional):
Type: (key: keyof T, direction: 'asc' | 'desc') => void
Callback function triggered when a sortable column header is clicked.




---

CSR-Specific Props

1. data (required for CSR):
Type: T[]
The dataset to be rendered in the table.




---

SSR-Specific Props

1. baseUrl (required for SSR):
Type: string
The base URL for fetching data from the server.


2. createQueryParams (required for SSR):
Type: (page: number, offset: number, sortKey?: keyof T, sortDirection?: 'asc' | 'desc', searchQuery?: string) => string
A function to generate query parameters for API requests based on the table state (pagination, sorting, and filtering).


3. extractDataFromResponse (required for SSR):
Type: (response: any) => T[]
A function to extract table data from the API response.


4. extractTotalRecordsFromResponse (required for SSR):
Type: (response: any) => number
A function to extract the total record count for pagination from the API response.


5. extractTimeFromResponse (optional for SSR):
Type: (response: any) => string
A function to extract a timestamp or update time from the API response.




---

Header Interface

The Header interface defines the structure of a table column.

export interface Header<T> {
  title: string; // The display title of the column
  datakey: keyof T; // The key of the field in the data object
  alignment?: 'left' | 'center' | 'right'; // Text alignment for the column. Default is 'left'.
  render?: (item: T) => JSX.Element; // Custom render function for the column
  sortable?: boolean; // Whether the column is sortable. Default is `false`.
}


---

This non-tabular format ensures clarity while listing props and their types with descriptions. Let me know if you need further refinements!

