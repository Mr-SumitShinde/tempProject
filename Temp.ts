import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ValpreReactDataTable } from './ValpreReactDataTable'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';

describe('ValpreReactDataTable Error Handling', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock(); // Ensure fetch is mocked
  });

  it('calls onError when fetch fails', async () => {
    const mockOnError = jest.fn();
    fetchMock.mockReject(new Error('Failed to fetch')); // Simulate a network error

    const { getByText } = render(<ValpreReactDataTable url="mock-url" columnDefs={[]} onError={mockOnError} />);

    // Normally you'd trigger some action that causes the fetch, such as:
    // fireEvent.click(getByText('Load Data')); // assuming 'Load Data' triggers the fetch

    await waitFor(() => expect(mockOnError).toHaveBeenCalledTimes(1));
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
  });
});