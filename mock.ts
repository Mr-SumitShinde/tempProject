const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const requestTypes = ['Identify Verification', 'STP', 'FCRM'];
const statuses = ['PROCESSING', 'REJECTED', 'APPROVED', 'REVIEW', 'ABANDONED', 'LINK EXPIRED'];
const submittedByNames = ['Swati Lal', 'Ram Khetan', 'Lovina Roy', 'Wendy Bird', 'David Park', 'Anant Raut'];
const clientNames = ['John Doe', 'Shobhit Jain', 'Michael Burrows', 'Rahul Guru', 'Neha Saxena', 'Rohan Bhatia'];

// Function to generate a random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split('T')[0];
}

// Generate mock data with 537 random entries
const mockData = Array.from({ length: 537 }).map((_, index) => ({
  requestNo: `PB${['IDV', 'STP', 'CRM'][Math.floor(Math.random() * 3)]}${1300 + index}`,
  clientRefId: Math.floor(1000000 + Math.random() * 9000000),
  requestType: requestTypes[Math.floor(Math.random() * requestTypes.length)],
  clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
  submittedBy: submittedByNames[Math.floor(Math.random() * submittedByNames.length)],
  dateCreated: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

app.get('/data', (req, res) => {
  const {
    page = 1,
    offset = 10,
    sortKey = 'dateCreated',
    sortDirection = 'asc',
    search = '',
  } = req.query;

  let filteredData = [...mockData];

  // SmartSearch logic
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchLower)
      )
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