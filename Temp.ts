const express = require('express');
const app = express();
const PORT = 3000;

// Mock data setup (ensure this is defined in your script or import it appropriately)
const data = {
    items: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: `Value ${i + 1}`,
        status: ['Active', 'Inactive', 'Pending'][i % 3]
    })),
    totalCount: 100
};

app.use(express.json());

app.get('/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const offSet = parseInt(req.query.offset) || 10;  // Changed from pageSize to offSet for clarity
    const start = (page - 1) * offSet;  // Calculate the starting index

    // Use the offSet to determine how many items to return from the starting index
    const paginatedItems = data.items.slice(start, start + offSet);

    res.json({
        items: paginatedItems,
        totalCount: data.totalCount
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});