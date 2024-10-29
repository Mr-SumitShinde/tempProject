import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgGridReact } from '@ag-grid-community/react';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(() => <div>Mocked AgGridReact</div>),
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

  it('displays loading component when loading', async () => {
    const loadingComponent = <div>Loading...</div>;
    
    // Mock fetch to keep it in a loading state
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      new Promise(() => {})
    );

    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        loadingComponent={loadingComponent}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    (global.fetch as jest.Mock).mockRestore();
  });

  it('handles error and displays error message', async () => {
    const onError = jest.fn();
    const errorMessage = 'An error occurred';

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    (global.fetch as jest.Mock).mockRestore();
  });

  it('calls onGridReady with a valid data source and executes getRows', async () => {
    const onGridReadyMock = jest.fn();
    
    // Mock fetch response for getRows
    const mockData = {
      rows: [{ name: 'John Doe', age: 30 }],
      totalRowCount: 1,
    };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onGridReady={onGridReadyMock}
      />
    );

    // Simulate grid ready event
    await act(async () => {
      onGridReadyMock.mock.calls[0][0].api.setServerSideDatasource({
        getRows: async (params) => {
          await params.successCallback(mockData.rows, mockData.totalRowCount);
        },
      });
    });

    await waitFor(() => {
      expect(onGridReadyMock).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        `${url}/api/data?startRow=0&endRow=100&sort_by=id&order=asc&filters={}`,
        expect.anything()
      );
      expect(screen.getByText('Mocked AgGridReact')).toBeInTheDocument();
    });

    (global.fetch as jest.Mock).mockRestore();
  });

  it('renders column definitions correctly', async () => {
    render(<ValpreReactDataTable url={url} columnDefs={columnDefs} />);

    await waitFor(() => {
      expect(AgGridReact).toHaveBeenCalledWith(
        expect.objectContaining({
          columnDefs,
        }),
        {}
      );
    });
  });
});