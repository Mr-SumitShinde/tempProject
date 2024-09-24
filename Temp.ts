app.get('/api/get-rows', (req, res) => {
  const { startRow, endRow, sortModel, filterModel } = req.query;

  // Parse the incoming JSON string for sortModel and filterModel
  const parsedSortModel = sortModel ? JSON.parse(sortModel) : [];
  const parsedFilterModel = filterModel ? JSON.parse(filterModel) : {};

  let filteredData = filterData(mockData, parsedFilterModel);
  filteredData = sortData(filteredData, parsedSortModel);

  const rows = filteredData.slice(Number(startRow), Number(endRow));
  const totalRowCount = filteredData.length;

  res.json({ rows, totalRowCount }); // Ensure totalRowCount is returned correctly
});