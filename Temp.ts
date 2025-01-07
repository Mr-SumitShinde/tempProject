Here’s an FAQ section for the ValpreReactDataTable:


---

FAQ

1. What is ValpreReactDataTable?

ValpreReactDataTable is a reusable, type-safe React table component that supports both Client-Side Rendering (CSR) and Server-Side Rendering (SSR). It provides sorting, pagination, and search functionality while allowing developers to customize column rendering.


---

2. How do I choose between CSR and SSR modes?

Use CSR when:

The dataset is small and can be fully loaded into the client memory.

You want the client to handle filtering, sorting, and pagination.


Use SSR when:

The dataset is large, and loading everything into memory is inefficient.

Filtering, sorting, and pagination need to be performed on the server.




---

3. What are the key differences between CSR and SSR props?

CSR requires the data prop to provide the entire dataset for the table.

SSR requires the following:

baseUrl: The endpoint for fetching data.

createQueryParams: A function to build query strings based on the table state (pagination, sorting, etc.).

extractDataFromResponse: A function to extract the dataset from the server response.

extractTotalRecordsFromResponse: A function to extract the total record count for pagination.




---

4. Can I customize the rendering of specific table columns?

Yes, use the render property in the Header definition to specify a custom render function. For example:

{
  title: 'Actions',
  datakey: 'actions',
  render: (item) => <button onClick={() => alert(`Edit ${item.name}`)}>Edit</button>,
}


---

5. How can I enable sorting for a column?

Set the sortable property to true in the Header definition:

{
  title: 'Name',
  datakey: 'name',
  sortable: true,
}


---

6. How do I specify the default sort column and direction?

Use the defaultSortKey and defaultSortDirection props:

<ValpreReactDataTable
  defaultSortKey="name"
  defaultSortDirection="asc"
/>


---

7. How can I integrate the table with an API?

For SSR, you can integrate with your API by providing:

1. baseUrl: The API endpoint.


2. createQueryParams: A function to generate query strings for filtering, sorting, and pagination.


3. extractDataFromResponse: A function to extract the table data from the API response.


4. extractTotalRecordsFromResponse: A function to extract the total record count.



Example:

<ValpreReactDataTable
  renderMode="SSR"
  baseUrl="https://api.example.com/data"
  createQueryParams={(page, offset, sortKey, sortDirection, searchQuery) =>
    `page=${page}&offset=${offset}&sortKey=${sortKey}&sortDirection=${sortDirection}&search=${searchQuery}`
  }
  extractDataFromResponse={(response) => response.data}
  extractTotalRecordsFromResponse={(response) => response.totalCount}
/>


---

8. How can I style the table?

You can style the table using CSS or inline styles. For example:

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

9. Can I paginate the table?

Yes, the table supports pagination. You can control the number of rows per page using the pageSize prop. Pagination is handled differently in CSR and SSR:

CSR: Pagination is managed locally using the data prop.

SSR: Pagination is managed on the server using createQueryParams.



---

10. What happens if no data is provided in CSR mode?

An error will be thrown, as the data prop is required for CSR mode. Ensure the data prop is provided and properly typed.


---

11. Can I disable the search functionality?

Yes, search is disabled by default. To enable it, set the showSearch prop to true:

<ValpreReactDataTable showSearch />


---

12. Does it support dynamic row actions?

Yes, you can define dynamic row actions using the render function in the Header. For example:

{
  title: 'Actions',
  datakey: 'actions',
  render: (item) => (
    <div>
      <button onClick={() => alert(`Edit ${item.name}`)}>Edit</button>
      <button onClick={() => alert(`Delete ${item.name}`)}>Delete</button>
    </div>
  ),
}


---

13. How do I handle large datasets?

For large datasets, use SSR mode. This ensures only the required data for the current page is fetched from the server, reducing memory usage on the client.


---

14. Is it compatible with TypeScript?

Yes, ValpreReactDataTable is fully type-safe and compatible with TypeScript. Use the generic type T to define the shape of your data and enforce type safety for headers and other props.


---

15. Can I contribute to the project?

Absolutely! Contributions are welcome. Please open an issue or create a pull request on the GitHub repository.


---

Let me know if you need further adjustments to the FAQ!

