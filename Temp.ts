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