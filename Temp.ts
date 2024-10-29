import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';
import '@testing-library/jest-dom';

// Define fetch as a Jest mock function globally if not already defined
if (!global.fetch) {
  global.fetch = jest.fn();
}
const mockFetch = global.fetch as jest.Mock;

describe('ValpreReactDataTable Component Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const defaultProps = {
    url: 'http://example.com',
    columnDefs: [{ field: 'name' }],
    onError: jest.fn(),
    loadingComponent: <div>Loading...</div>
  };

  describe('Basic rendering and fetching', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({
          totalRowCount: 100,
          rows: [{ id: 1, name: 'Item 1' }]
        })
      });
    });

    it('renders without crashing and displays initial message', () => {
      render(<ValpreReactDataTable {...defaultProps} />);
      expect(screen.getByText('No rows to display!')).toBeInTheDocument();
    });

    it('calls fetch with correct URL when the component mounts', async () => {
      render(<ValpreReactDataTable {...defaultProps} />);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`${defaultProps.url}/api/data`));
    });
  });

  describe('Loading and Error handling', () => {
    it('displays loading component while fetching data', () => {
      render(<ValpreReactDataTable {...defaultProps} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles errors during data fetch', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      render(<ValpreReactDataTable {...defaultProps} />);
      await waitFor(() => expect(defaultProps.onError).toHaveBeenCalled());
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles an empty data response correctly', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ totalRowCount: 0, rows: [] })
      });
      render(<ValpreReactDataTable {...defaultProps} />);
      await waitFor(() => expect(screen.getByText('No rows to display!')).toBeInTheDocument());
    });

    it('handles multiple sorts and filters', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({
          totalRowCount: 10,
          rows: [{ id: 2, name: 'Filtered Item' }]
        })
      });
      const advancedProps = {
        ...defaultProps,
        columnDefs: [{ field: 'name', sortable: true, filter: true }]
      };
      render(<ValpreReactDataTable {...advancedProps} />);
      await waitFor(() => expect(screen.getByText('Filtered Item')).toBeInTheDocument());
    });

    it('deals with unexpected server responses', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(null)
      });
      render(<ValpreReactDataTable {...defaultProps} />);
      await waitFor(() => expect(defaultProps.onError).toHaveBeenCalled());
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});