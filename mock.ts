const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Mock Data with 513 items
const mockData = Array.from({ length: 513 }).map((_, index) => ({
  id: index + 1,
  dateCreated: "01/01/2024",
  ssid: 213456 + index,
  arnum: 333 + index,
  name: `User ${index + 1}`,
  submittedBy: "submitter",
  email: `user${index + 1}@example.com`,
  status: "Case created",
}));

app.get('/data', (req, res) => {
  const {
    page = 1,
    offset = 10,
    sortKey = 'id',
    sortDirection = 'asc',
    search = '',
  } = req.query;

  let filteredData = [...mockData];

  // SmartSearch logic
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        item.ssid.toString().includes(searchLower) ||
        item.arnum.toString().includes(searchLower)
    );
  }

  // Sorting logic
  if (sortKey) {
    filteredData.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic
  const startIndex = (page - 1) * offset;
  const endIndex = startIndex + parseInt(offset, 10);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    total: filteredData.length,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`);
});