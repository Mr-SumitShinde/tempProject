<ValpreReactDataTable
  baseUrl="http://localhost:4000/data"
  createQueryParams={(page, offset, sortKey, sortDirection, searchQuery) =>
    `page=${page}&offset=${offset}&sortKey=${sortKey || ''}&sortDirection=${sortDirection || ''}&search=${searchQuery || ''}`
  }
  headers={[
    { title: 'Request No.', datakey: 'requestNo', alignment: 'left', sortable: true },
    { title: 'Client Ref Id', datakey: 'clientRefId', alignment: 'center', sortable: true },
    { title: 'Request Type', datakey: 'requestType', alignment: 'left', sortable: true },
    { title: 'Client Name', datakey: 'clientName', alignment: 'left', sortable: true },
    { title: 'Submitted by', datakey: 'submittedBy', alignment: 'left', sortable: true },
    { title: 'Date Created', datakey: 'dateCreated', alignment: 'center', sortable: true },
    { title: 'Status', datakey: 'status', alignment: 'center', sortable: true },
  ]}
  pageSize={10}
  defaultSortKey="dateCreated"
  defaultSortDirection="asc"
  extractDataFromResponse={(response) => response.data}
  extractTotalRecordsFromResponse={(response) => response.total}
  extractTimeFromResponse={(response) => response.timestamp}
/>