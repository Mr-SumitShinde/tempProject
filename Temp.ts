<ValpreReactDataTable
    baseUrl="http://localhost:3000/data"
    createQueryParams={(page, pageSize) => `page=${page}&pageSize=${pageSize}`}
    headers={headers}
    initialPage={1}
    pageSize={10}
    extractDataFromResponse={(responseData) => responseData.items}
    extractTotalRecordsFromResponse={(responseData) => responseData.totalCount}
/>