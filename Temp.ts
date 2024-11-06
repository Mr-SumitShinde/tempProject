const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Mock data
const data = {
    items: [
        { clientName: 'John Smith', status: 'READY TO SEND', requestNo: 'PB2665001', submittedBy: 'Rebecca O’Connell', dateCreated: '30/9/2024' },
        { clientName: 'Emma Johnson', status: 'APPROVED', requestNo: 'PB2665000', submittedBy: 'Andrew Stocks', dateCreated: '20/10/2024' },
        { clientName: 'Olivia Brown', status: 'EXPIRED LINK', requestNo: 'PB2354008', submittedBy: 'Andrew Stocks', dateCreated: '16/9/2024' },
        // Add more items as needed
    ],
    totalCount: 3
};

app.get('/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const paginatedItems = data.items.slice(offset, offset + pageSize);

    res.json({
        items: paginatedItems,
        totalCount: data.totalCount
    });
});

app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
});