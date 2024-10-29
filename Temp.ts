import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ValpreReactDataTable from './ValpreReactDataTable'; // Adjust the import path as needed
import { AgGridReact } from '@ag-grid-community/react';

// Mock AgGridReact to avoid actual rendering in tests
jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(() => <div data-testid="ag-grid-react"></div>)
}));

describe('ValpreReactDataTable Component', () => {
  const defaultProps = {
    url: '/test-url',
    columnDefs: [{ field: 'name' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    expect(screen.getByTestId('ag-grid-react')).toBeInTheDocument();
  });

  test('displays loading component when loading is true', () => {
    const loadingComponent = <div data-testid="loading-component">Loading...</div>;
    render(<ValpreReactDataTable {...defaultProps} loadingComponent={loadingComponent} />);
    
    // Mock loading state
    fireEvent(gridRef.current!.api, 'setLoading', true);
    
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  test('displays error message when an error occurs', async () => {
    const mockError = new Error('Test error');
    const onErrorMock = jest.fn();

    render(<ValpreReactDataTable {...defaultProps} onError={onErrorMock} />);
    
    // Trigger error in data fetching
    fireEvent(gridRef.current!.api, 'setError', mockError);
    
    expect(onErrorMock).toHaveBeenCalledWith(mockError);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  test('calls onGridReady and sets data source', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    const onGridReady = jest.fn();
    
    fireEvent(gridRef.current!.api, 'onGridReady', onGridReady);
    
    expect(onGridReady).toHaveBeenCalledTimes(1);
    expect(gridRef.current!.api.getServerSideDatasource()).toBeDefined();
  });

  test('fetches data correctly on getRows and calls success callback', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ totalRowCount: 50, rows: [{ id: 1, name: 'Test' }] }),
    });
    global.fetch = fetchMock;

    render(<ValpreReactDataTable {...defaultProps} />);
    const getRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    };
    
    await waitFor(() => getRows(getRowsParams));

    expect(fetchMock).toHaveBeenCalledWith(
      '/test-url/api/data?startRow=0&endRow=20&sort_by=id&order=asc&filters={}'
    );
    expect(getRowsParams.success).toHaveBeenCalledWith({
      rowData: [{ id: 1, name: 'Test' }],
      rowCount: 50,
    });
  });
});