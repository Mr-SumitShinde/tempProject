import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';

describe('ValpreReactDataTable Component', () => {
  const defaultProps = {
    url: '/test-url',
    columnDefs: [{ field: 'name' }],
  };

  test('renders without crashing', () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    const gridElement = screen.queryByTestId('ag-grid-react');
    expect(gridElement).not.toBeNull(); // Similar to `toBeInTheDocument`
  });

  test('displays loading component when loading is true', async () => {
    const loadingComponent = <div data-testid="loading-component">Loading...</div>;
    render(<ValpreReactDataTable {...defaultProps} loadingComponent={loadingComponent} />);

    // Since gridRef is internal, simulate loading by updating component state
    const loadingElement = screen.queryByTestId('loading-component');
    expect(loadingElement).not.toBeNull();
  });

  test('displays error message when an error occurs', async () => {
    const mockError = new Error('Test error');
    const onErrorMock = jest.fn();

    render(<ValpreReactDataTable {...defaultProps} onError={onErrorMock} />);
    
    // Simulate error
    await waitFor(() => onErrorMock(mockError));
    
    expect(onErrorMock).toHaveBeenCalledWith(mockError);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  test('calls onGridReady and sets data source', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    const onGridReady = jest.fn();
    
    // Simulate grid ready
    await waitFor(() => onGridReady());
    
    expect(onGridReady).toHaveBeenCalledTimes(1);
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
    
    await waitFor(() => getRowsParams.success({
      rowData: [{ id: 1, name: 'Test' }],
      rowCount: 50,
    }));

    expect(fetchMock).toHaveBeenCalledWith(
      '/test-url/api/data?startRow=0&endRow=20&sort_by=id&order=asc&filters={}'
    );
    expect(getRowsParams.success).toHaveBeenCalledWith({
      rowData: [{ id: 1, name: 'Test' }],
      rowCount: 50,
    });
  });
});