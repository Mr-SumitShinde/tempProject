import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';
import '@testing-library/jest-dom/extend-expect';

describe('ValpreReactDataTable Component', () => {
  const defaultProps = {
    url: 'http://example.com',
    columnDefs: [{ field: 'name' }],
    onError: jest.fn(),
    loadingComponent: <div>Loading...</div>
  };

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    }));
  });

  it('renders without crashing and displays initial message', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    // Verify the initial loading or no-data state
    expect(screen.getByText('No rows to display!')).toBeInTheDocument();

    // Wait for the mock fetch to resolve and the component to update
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL when the component mounts', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${defaultProps.url}/api/data`));
  });

  it('displays loading component while fetching data', () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles errors during data fetch', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(defaultProps.onError).toHaveBeenCalled());
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('displays data when fetched successfully', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
  });
});