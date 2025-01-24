fetch('http://example.com/api', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors' // Enable CORS mode
});