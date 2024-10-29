it('displays loading component when loading', async () => {
  const loadingComponent = <div>Loading...</div>;
  
  render(
    <ValpreReactDataTable
      url={url}
      columnDefs={columnDefs}
      loadingComponent={loadingComponent}
    />
  );

  // Simulate loading state directly if needed
  screen.getByText('Loading...');
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

  // Use waitFor in case `onGridReady` is called asynchronously
  waitFor(() => {
    expect(onGridReadyMock).toHaveBeenCalled();
  });
});