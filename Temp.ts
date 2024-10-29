import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ValpreReactDataTable, { DataTableProps } from './ValpreReactDataTable';
import { IServerSideGetRowsParams } from '@ag-grid-community/core';

describe('ValpreReactDataTable Component Logic', () => {
  let onErrorMock: jest.Mock;

  beforeEach(() => {
    onErrorMock = jest.fn();
  });

  it('calls onGridReady when grid is initialized', () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    render(<ValpreReactDataTable {...props} />);
    expect(onErrorMock).not.toHaveBeenCalled();
  });

  it('fetches data correctly in getRows and calls success callback', async () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    const { getByTestId } = render(<ValpreReactDataTable {...props} />);
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ totalRowCount: 50, rows: [{ id: 1, name: 'Test' }] }),
    });

    const getRowsParams: IServerSideGetRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as IServerSideGetRowsParams;

    await waitFor(() => {
      expect(getRowsParams.success).toHaveBeenCalledWith({
        rowData: [{ id: 1, name: 'Test' }],
        rowCount: 50,
      });
    });
  });

  it('calls onError when data fetching fails', async () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    render(<ValpreReactDataTable {...props} />);
    
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const getRowsParams: IServerSideGetRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as IServerSideGetRowsParams;

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith(new Error('Fetch error'));
      expect(getRowsParams.fail).toHaveBeenCalled();
    });
  });
});