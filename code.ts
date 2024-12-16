<ValpreReactDataTable
  baseUrl="http://localhost:4000/data"
  createQueryParams={(page, offset, sortKey, sortDirection, searchQuery) =>
    `page=${page}&offset=${offset}&sortKey=${sortKey || ''}&sortDirection=${sortDirection || ''}&search=${searchQuery || ''}`
  }
  headers={[
    { title: 'Name', datakey: 'name', alignment: 'left', sortable: true },
    { title: 'Email', datakey: 'email', alignment: 'center', sortable: true },
    { title: 'Status', datakey: 'status', alignment: 'right', sortable: false },
    { title: 'SSID', datakey: 'ssid', alignment: 'right', sortable: true },
    { title: 'ARNUM', datakey: 'arnum', alignment: 'right', sortable: true },
  ]}
  pageSize={10}
  defaultSortKey="name"
  defaultSortDirection="asc"
  extractDataFromResponse={(response) => response.data}
  extractTotalRecordsFromResponse={(response) => response.total}
  extractTimeFromResponse={(response) => response.timestamp}
/>