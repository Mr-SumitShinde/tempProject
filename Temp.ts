const headers = [
    { title: 'Client name', dataKey: 'clientName', alignment: 'left' },
    {
        title: 'Status',
        dataKey: 'status',
        alignment: 'center',
        render: (item) => {
            const statusStyles = {
                'READY TO SEND': { color: 'blue', icon: '🔵' },
                'APPROVED': { color: 'green', icon: '🟢' },
                'EXPIRED LINK': { color: 'gray', icon: '⛔' },
                'REJECTED': { color: 'red', icon: '🔴' },
                'REVIEW': { color: 'orange', icon: '🟠' }
            };
            const status = statusStyles[item.status] || { color: 'black', icon: '❓' }; // Default case
            return (
                <div style={{ color: status.color, fontWeight: 'bold' }}>
                    {status.icon} {item.status}
                </div>
            );
        }
    },
    { title: 'Request No.', dataKey: 'requestNo', alignment: 'center' },
    { title: 'Submitted by', dataKey: 'submittedBy', alignment: 'left' },
    { title: 'Date created', dataKey: 'dateCreated', alignment: 'right' }
];