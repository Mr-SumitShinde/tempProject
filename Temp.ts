import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgGridReact } from '@ag-grid-community/react';
import ValpreReactDataTable from './ValpreReactDataTable';

jest.mock('@ag-grid-community/react', () => ({
  AgGridReact: jest.fn(() => <div>Mocked AgGridReact</div>),
}));

describe('ValpreReactDataTable', () => {
  const columnDefs = [{ field: 'name' }, { field: 'age' }];
  const url = 'https://mock-api.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ValpreReactDataTable url={url} columnDefs={columnDefs} />);
    expect(screen.getByText('Mocked AgGridReact')).toBeInTheDocument();
  });

  it('displays loading component when loading', async () => {
    const loadingComponent = <div>Loading...</div>;
    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        loadingComponent={loadingComponent}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error and displays error message', async () => {
    const onError = jest.fn();
    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onError={onError}
      />
    );

    // Simulate error state
    const errorMessage = 'An error occurred';
    screen.getByText(errorMessage);

    expect(onError).toHaveBeenCalled();
  });

  it('calls onGridReady with a valid data source', () => {
    const onGridReadyMock = jest.fn();
    render(
      <ValpreReactDataTable
        url={url}
        columnDefs={columnDefs}
        onGridReady={onGridReadyMock}
      />
    );

    expect(onGridReadyMock).toHaveBeenCalled();
  });

  it('renders column definitions correctly', async () => {
    render(<ValpreReactDataTable url={url} columnDefs={columnDefs} />);

    await waitFor(() => {
      expect(AgGridReact).toHaveBeenCalledWith(
        expect.objectContaining({
          columnDefs,
        }),
        {}
      );
    });
  });
});