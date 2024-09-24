const express = require('express');
const cors = require('cors'); // Import the cors package

const mockData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  age: Math.floor(Math.random() * 80) + 1,
  country: ['USA', 'India', 'Germany', 'Australia'][Math.floor(Math.random() * 4)],
}));

const app = express();
const PORT = 4000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

const sortData = (data, sortModel) => {
  if (!sortModel || sortModel.length === 0) return data;

  const sortedData = [...data];
  const sort = sortModel[0];
  const { colId, sort: sortOrder } = sort;

  sortedData.sort((a, b) => {
    if (a[colId] < b[colId]) return sortOrder === 'asc' ? -1 : 1;
    if (a[colId] > b[colId]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedData;
};

const filterData = (data, filterModel) => {
  if (!filterModel || Object.keys(filterModel).length === 0) return data;

  let filteredData = [...data];

  Object.keys(filterModel).forEach((field) => {
    const filter = filterModel[field];
    filteredData = filteredData.filter((item) => {
      const value = item[field].toString().toLowerCase();
      const filterValue = filter.filter.toLowerCase();
      return value.includes(filterValue);
    });
  });

  return filteredData;
};

app.post('/api/get-rows', (req, res) => {
  const { startRow, endRow, sortModel, filterModel } = req.body;

  let filteredData = filterData(mockData, filterModel);
  filteredData = sortData(filteredData, sortModel);

  const rows = filteredData.slice(startRow, endRow);
  const totalRowCount = filteredData.length;

  res.json({ rows, totalRowCount });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});