import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(({ onGridReady }) => {
    if (onGridReady) {
      // Mock an api object with setServerSideDatasource method
      const mockApi = {
        setServerSideDatasource: jest.fn(),
      };
      // Simulate the onGridReady event to trigger the callback
      onGridReady({ api: mockApi });
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
    const mockData = {
      rows: [{ name: 'John Doe', age: 30 }],
      totalRowCount: 1,
    };

    // Mock fetch response for getRows
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    }) as jest.Mock;

    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onGridReady={onGridReadyMock}
      />
    );

    // Ensure the mock api is correctly structured
    await act(async () => {
      const api = onGridReadyMock.mock.calls[0]?.[0]?.api;
      if (api && api.setServerSideDatasource) {
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

    // Restore fetch to original implementation
    (global.fetch as jest.Mock).mockRestore();
  });
});