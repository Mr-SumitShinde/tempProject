import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  fetch.mockResolvedValue({
    json: () => Promise.resolve({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    })
  });
});

describe('ValpreReactDataTable Component', () => {
  const defaultProps = {
    url: 'http://example.com',
    columnDefs: [{ field: 'name' }],
    onError: jest.fn(),
    loadingComponent: <div>Loading...</div>
  };

  it('renders without crashing and displays initial message', () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    expect(screen.getByText('No rows to display!')).toBeInTheDocument();
  });

  it('calls fetch with correct URL on grid ready', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    // Wait for fetch to be called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${defaultProps.url}/api/data`));
  });

  it('displays loading component when data is being fetched', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    // Initially, the loading component should be in the document
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles and displays errors during data fetch', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(defaultProps.onError).toHaveBeenCalledWith(new Error('Network error')));
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('displays data when fetched successfully', async () => {
    render(<ValpreReactDataTable {...defaultProps} />);
    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
  });
});