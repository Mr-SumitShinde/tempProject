import { IServerSideGetRowsParams } from '@ag-grid-community/core';
import React from 'react';
import ValpreReactDataTable, { DataTableProps } from './ValpreReactDataTable';

describe('ValpreReactDataTable Component Logic', () => {
  let onErrorMock: jest.Mock;
  let onGridReadyMock: jest.Mock;

  beforeEach(() => {
    onErrorMock = jest.fn();
    onGridReadyMock = jest.fn();
  });

  it('calls onGridReady when grid is initialized', () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    const component = new ValpreReactDataTable(props);
    component.onGridReady({} as any);
    expect(onGridReadyMock).toHaveBeenCalled();
  });

  it('fetches data correctly in getRows and calls success callback', async () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    const component = new ValpreReactDataTable(props);
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ totalRowCount: 50, rows: [{ id: 1, name: 'Test' }] }),
    });
    const getRowsParams: IServerSideGetRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as IServerSideGetRowsParams;
    await component.getRows(getRowsParams);
    expect(global.fetch).toHaveBeenCalledWith(
      '/test-url/api/data?startRow=0&endRow=20&sort_by=id&order=asc&filters={}'
    );
    expect(getRowsParams.success).toHaveBeenCalledWith({
      rowData: [{ id: 1, name: 'Test' }],
      rowCount: 50,
    });
  });

  it('calls onError when data fetching fails', async () => {
    const props: DataTableProps = {
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    };
    const component = new ValpreReactDataTable(props);
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));
    const getRowsParams: IServerSideGetRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as IServerSideGetRowsParams;
    await component.getRows(getRowsParams);
    expect(onErrorMock).toHaveBeenCalledWith(new Error('Fetch error'));
    expect(getRowsParams.fail).toHaveBeenCalled();
  });
});