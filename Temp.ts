import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(({ onGridReady }) => {
    // Mock `api` with `setGridOption` instead of `setServerSideDatasource`
    const mockApi = {
      setGridOption: jest.fn(),
    };
    onGridReady && onGridReady({ api: mockApi });
    return <div>Mocked AgGridReact</div>;
  }),
}));

describe('ValpreReactDataTable onGridReady', () => {
  const columnDefs = [{ field: 'name' }, { field: 'age' }];
  const url = 'https://mock-api.com';
  const mockApiResponse = { rows: [{ name: 'John Doe', age: 30 }], totalRowCount: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls setGridOption with the dataSource', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    }) as jest.Mock;

    const onGridReadyMock = jest.fn();
    render(<ValpreReactDataTable url={url} columnDefs={columnDefs} onGridReady={onGridReadyMock} />);

    await act(async () => {
      const api = onGridReadyMock.mock.calls[0][0].api;
      expect(api.setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.objectContaining({
          getRows: expect.any(Function),
        })
      );
    });

    global.fetch.mockRestore();
  });

  it('sets loading to true and makes API call on getRows', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    }) as jest.Mock;

    const { getByText } = render(<ValpreReactDataTable url={url} columnDefs={columnDefs} />);

    const onGridReadyMock = jest.fn();
    await act(async () => {
      onGridReadyMock.mock.calls[0][0].api.setGridOption('serverSideDatasource', {
        getRows: async (params) => {
          expect(params.startRow).toBe(0);
          expect(params.endRow).toBe(100);
          expect(params.successCallback).toBeCalledWith(mockApiResponse.rows, mockApiResponse.totalRowCount);
        },
      });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${url}/api/data?startRow=0&endRow=100&sort_by=id&order=asc&filters={}`);
      expect(getByText('Mocked AgGridReact')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});