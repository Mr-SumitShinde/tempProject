app.post('/api/get-rows', (req, res) => {
  const { startRow, endRow, sortModel, filterModel } = req.body;

  let filteredData = filterData(mockData, filterModel);
  filteredData = sortData(filteredData, sortModel);

  const rows = filteredData.slice(startRow, endRow);
  const totalRowCount = filteredData.length;

  res.json({ rows, totalRowCount }); // Ensure totalRowCount is returned correctly
});