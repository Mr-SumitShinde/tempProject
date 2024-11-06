const mockData = Array.from({ length: 100 }, (_, index) => ({
    clientName: `Client ${index + 1}`,
    status: ['READY TO SEND', 'APPROVED', 'EXPIRED LINK', 'REJECTED', 'REVIEW'][index % 5],
    requestNo: `PB${2665000 + index}`,
    submittedBy: ['Rebecca O’Connell', 'Andrew Stocks'][index % 2],
    dateCreated: `${new Date(2024, 8, (index % 30) + 1).toLocaleDateString('en-US')}`
}));