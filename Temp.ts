import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';
import '@testing-library/jest-dom/extend-expect';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    })
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('ValpreReactDataTable Component', () => {
  const defaultProps = {
    url: 'http://example.com',
    columnDefs: [{ field: 'name' }],
    onError: jest.fn()
  };

  it('renders without crashing', () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    expect(screen.getByText('No rows to display!')).toBeInTheDocument();
  });

  it('initializes the grid API on grid ready', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(screen.queryByText('No rows to display!')).not.toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('displays loading component when fetching data', () => {
    render(<ValpreReactDataTable {...defaultProps} loadingComponent={<div>Loading...</div>} />);
    fireEvent.gridReady(screen.getByRole('grid'));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles errors during data fetch', async () => {
    // Override fetch to simulate an error
    fetch.mockImplementationOnce(() => Promise.reject('Network error'));
    render(<ValpreReactDataTable {...defaultProps} />);
    fireEvent.gridReady(screen.getByRole('grid'));
    await waitFor(() => expect(defaultProps.onError).toHaveBeenCalledWith('Network error'));
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('correctly fetches data with sort and filter parameters', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    const params = {
      request: {
        startRow: 0,
        endRow: 20,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        filterModel: { name: { filter: 'Item' } }
      }
    };

    fireEvent.gridReady(screen.getByRole('grid'), params);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `${defaultProps.url}/api/data?startRow=0&endRow=20&sort_by=name&order=asc&filters={"name":"Item"}`
    ));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('updates the rows and total row count based on the response', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    fireEvent.gridReady(screen.getByRole('grid'));
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();  // Assume this selector is for row count
    });
  });
});