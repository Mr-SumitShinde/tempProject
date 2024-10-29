import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();


it('displays loading component when loading', async () => {
  const loadingComponent = <div>Loading...</div>;

  // Mock fetch to keep it in a loading state
  fetchMock.mockResponse(() => new Promise(() => {}));

  render(
    <ValpreReactDataTable
      url={url}
      columnDefs={columnDefs}
      loadingComponent={loadingComponent}
    />
  );

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  fetchMock.mockReset(); // Clear mock
});