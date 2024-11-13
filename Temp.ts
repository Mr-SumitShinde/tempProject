const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4099;

app.use(cors());
app.use(express.json());

const count = 537;
const items = Array.from({ length: count }, (index) => ({
    clientName: `Client ${index + 1}`,
    status: ['READY TO SEND', 'APPROVED', 'EXPIRED LINK', 'REJECTED', 'REVIEW'][index % 5],
    requestNo: `PB${2665000 + index}`,
    submittedBy: ['Rebecca O\'Connell', 'Andrew Stocks'][index % 2],
    dateCreated: new Date(2024, 8, (index % 30) + 1).toLocaleDateString('en-US')
}));

const data = {
    items: items,
    totalCount: count
};

app.get('/idnv', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.offset) || 10;

    // Remove `page` and `offset` from the query parameters for filtering
    const filters = { ...req.query };
    delete filters.page;
    delete filters.offset;

    // Filter items based on all query parameters dynamically
    const filteredItems = data.items.filter(item => {
        return Object.keys(filters).every(key => {
            if (filters[key]) {
                return String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
            }
            return true;
        });
    });

    const offset = (page - 1) * pageSize;
    const paginatedItems = filteredItems.slice(offset, offset + pageSize);

    res.json({
        items: paginatedItems,
        totalCount: filteredItems.length
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});