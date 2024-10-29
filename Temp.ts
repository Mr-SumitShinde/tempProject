import { IServerSideGetRowsParams } from '@ag-grid-community/core';
import ValpreReactDataTable from './ValpreReactDataTable'; // Adjust import path as needed

describe('ValpreReactDataTable Component Logic', () => {
  let onErrorMock: jest.Mock;
  let onGridReadyMock: jest.Mock;

  beforeEach(() => {
    onErrorMock = jest.fn();
    onGridReadyMock = jest.fn();
  });

  it('calls onGridReady when grid is initialized', () => {
    const component = new ValpreReactDataTable({
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    });

    // Mock the onGridReady functionality
    component.onGridReady({} as any);

    expect(onGridReadyMock).toHaveBeenCalled();
  });

  it('fetches data correctly in getRows and calls success callback', async () => {
    const component = new ValpreReactDataTable({
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    });

    // Mock fetch response
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ totalRowCount: 50, rows: [{ id: 1, name: 'Test' }] }),
    });

    const getRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as unknown as IServerSideGetRowsParams;

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
    const component = new ValpreReactDataTable({
      url: '/test-url',
      columnDefs: [{ field: 'name' }],
      onError: onErrorMock,
    });

    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const getRowsParams = {
      request: { startRow: 0, endRow: 20, sortModel: [], filterModel: {} },
      success: jest.fn(),
      fail: jest.fn(),
    } as unknown as IServerSideGetRowsParams;

    await component.getRows(getRowsParams);

    expect(onErrorMock).toHaveBeenCalledWith(new Error('Fetch error'));
    expect(getRowsParams.fail).toHaveBeenCalled();
  });
});