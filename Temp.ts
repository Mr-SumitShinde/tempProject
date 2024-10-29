import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(({ onGridReady }) => {
    const mockApi = {
      setServerSideDatasource: jest.fn(),
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

  it('sets loading to true and makes API call on getRows', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    }) as jest.Mock;

    const { getByText } = render(
      <ValpreReactDataTable url={url} columnDefs={columnDefs} />
    );

    const onGridReadyMock = jest.fn();
    await act(async () => {
      onGridReadyMock.mock.calls[0][0].api.setServerSideDatasource({
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

    (global.fetch as jest.Mock).mockRestore();
  });

  it('handles sortModel and filterModel in getRows', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    }) as jest.Mock;

    const onGridReadyMock = jest.fn();
    await act(async () => {
      onGridReadyMock.mock.calls[0][0].api.setServerSideDatasource({
        getRows: async (params) => {
          const requestParams = {
            request: {
              startRow: 0,
              endRow: 100,
              sortModel: [{ colId: 'age', sort: 'desc' }],
              filterModel: { name: { filter: 'John' } },
            },
          };

          expect(global.fetch).toHaveBeenCalledWith(
            `${url}/api/data?startRow=0&endRow=100&sort_by=age&order=desc&filters={"name":"John"}`
          );
          params.successCallback(mockApiResponse.rows, mockApiResponse.totalRowCount);
        },
      });
    });

    (global.fetch as jest.Mock).mockRestore();
  });

  it('handles API error in getRows and sets error', async () => {
    const errorMessage = 'API error';
    global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));

    const onErrorMock = jest.fn();
    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onError={onErrorMock}
      />
    );

    const onGridReadyMock = jest.fn();
    await act(async () => {
      onGridReadyMock.mock.calls[0][0].api.setServerSideDatasource({
        getRows: async (params) => {
          try {
            await fetch(`${url}/api/data`);
          } catch (error) {
            expect(onErrorMock).toHaveBeenCalledWith(new Error(errorMessage));
            params.failCallback();
          }
        },
      });
    });

    (global.fetch as jest.Mock).mockRestore();
  });
});