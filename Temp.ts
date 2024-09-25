const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Load the JSON file into memory (mock database)
let mockData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/api/data', (req, res) => {
  const { startRow, endRow, sort_by = 'id', order = 'asc', filters } = req.query;
  let filteredData = [...mockData];
  
  // Apply filtering
  const parsedFilters = JSON.parse(filters || '{}');
  Object.keys(parsedFilters).forEach(field => {
    filteredData = filteredData.filter(item => item[field] === parsedFilters[field]);
  });

  // Apply sorting
  filteredData.sort((a, b) => {
    const fieldA = a[sort_by];
    const fieldB = b[sort_by];
    if (order === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Apply pagination
  const paginatedData = filteredData.slice(parseInt(startRow), parseInt(endRow));

  // Send the paginated, sorted, and filtered data
  res.json({
    rows: paginatedData,
    totalRows: filteredData.length
  });
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});