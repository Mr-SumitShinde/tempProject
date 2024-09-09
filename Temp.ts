const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Example API endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Another endpoint example
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ userId, name: "John Doe" });
});

// POST example
app.post('/api/user', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'User created', newUser });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});