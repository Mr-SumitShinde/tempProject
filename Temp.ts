import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(({ onGridReady }) => {
    if (onGridReady) {
      // Simulate the onGridReady event to trigger the callback
      onGridReady({ api: { setServerSideDatasource: jest.fn() } });
    }
    return <div>Mocked AgGridReact</div>;
  }),
}));

describe('ValpreReactDataTable', () => {
  const columnDefs = [{ field: 'name' }, { field: 'age' }];
  const url = 'https://mock-api.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ValpreReactDataTable url={url} columnDefs={columnDefs} />);
    expect(screen.getByText('Mocked AgGridReact')).toBeInTheDocument();
  });

  it('calls onGridReady with a valid data source and executes getRows', async () => {
    const onGridReadyMock = jest.fn();
    const setServerSideDatasourceMock = jest.fn();
    const mockData = {
      rows: [{ name: 'John Doe', age: 30 }],
      totalRowCount: 1,
    };

    // Mock fetch response for getRows
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onGridReady={onGridReadyMock}
      />
    );

    // Mock the API setServerSideDatasource function after onGridReady is called
    await act(async () => {
      if (onGridReadyMock.mock.calls[0]) {
        const api = onGridReadyMock.mock.calls[0][0].api;
        api.setServerSideDatasource({
          getRows: async (params) => {
            await params.successCallback(mockData.rows, mockData.totalRowCount);
          },
        });
      }
    });

    await waitFor(() => {
      expect(onGridReadyMock).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        `${url}/api/data?startRow=0&endRow=100&sort_by=id&order=asc&filters={}`,
        expect.anything()
      );
      expect(screen.getByText('Mocked AgGridReact')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});