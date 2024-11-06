Showing 1-10 of 99 items as of 01/11/2024 09:00 AM (GMT+1)
const sampleData = [
  {
    id: 1,
    date: '2024-11-01',
    description: 'Subscription Fee',
    moneyIn: 120,
    moneyOut: 0,
    balance: 5020,
  },
  {
    id: 2,
    date: '2024-11-02',
    description: 'Coffee Purchase',
    moneyIn: 0,
    moneyOut: 5,
    balance: 5015,
  },
];


const MoneyComponent = ({ amount }) => (
  <span style={{ color: amount > 0 ? 'green' : 'red' }}>
    {amount > 0 ? `+${amount}` : amount}
  </span>
);


const headers = [
  { title: 'Date', dataKey: 'date', alignment: 'left' },
  { title: 'Description', dataKey: 'description', alignment: 'left' },
  {
    title: 'Money In',
    dataKey: 'moneyIn',
    alignment: 'left',
    render: (item) => item.moneyIn !== 0 && <MoneyComponent amount={item.moneyIn} />,
  },
  {
    title: 'Money Out',
    dataKey: 'moneyOut',
    alignment: 'left',
    render: (item) => item.moneyOut !== 0 && <MoneyComponent amount={-item.moneyOut} />,
  },
  { title: 'Balance', dataKey: 'balance', alignment: 'right' },
];


import React from 'react';
import ReactDOM from 'react-dom';
import ValpreReactDataTable from './ValpreReactDataTable'; // Assume the component is in this file

const App = () => {
  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
    // Here you could fetch new data based on the page number
  };

  return (
    <div>
      <ValpreReactDataTable
        data={sampleData}
        onPageChange={handlePageChange}
        totalPages={5}
        headers={headers}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

