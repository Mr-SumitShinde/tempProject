app.get('/api/data', (req, res) => {
  const { page = 1, offset = 10, sortBy = 'id', orderBy = 'asc', ...filterParams } = req.query;

  const startRow = (page - 1) * offset;
  const endRow = page * offset;

  let filteredData = [...mockData];

  Object.keys(filterParams).forEach(field => {
    filteredData = filteredData.filter(item => String(item[field]) === String(filterParams[field]));
  });

  filteredData.sort((a, b) => {
    const fieldA = a[sortBy];
    const fieldB = b[sortBy];

    if (orderBy === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  const paginatedData = filteredData.slice(startRow, endRow);

  res.json({
    rows: paginatedData,
    totalRows: filteredData.length
  });
});