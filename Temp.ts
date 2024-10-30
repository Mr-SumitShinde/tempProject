function addFilterProperties(columnDefs) {
  return columnDefs.map(column => {
    if (column.isFilter) {
      return {
        ...column,
        filter: 'agTextColumnFilter',
        filterParams: {
          filterOptions: ["contains"],
          maxNumConditions: 1
        }
      };
    }
    return column; // return column as is if isFilter is not true
  });
}

// Example usage
const columnDefs = [
  { field: 'name', isFilter: true },
  { field: 'age' },
  { field: 'country', isFilter: true },
  { field: 'status' }
];

const updatedColumnDefs = addFilterProperties(columnDefs);
console.log(updatedColumnDefs);