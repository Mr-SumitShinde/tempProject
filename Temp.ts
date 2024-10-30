const addFilterProperties = columnDefs => 
  columnDefs.map(column => column.isFilter ? {
    ...column,
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ["contains"],
      maxNumConditions: 1
    }
  } : column);

// Example usage
const columnDefs = [
  { field: 'name', isFilter: true },
  { field: 'age' },
  { field: 'country', isFilter: true },
  { field: 'status' }
];

const updatedColumnDefs = addFilterProperties(columnDefs);
console.log(updatedColumnDefs);