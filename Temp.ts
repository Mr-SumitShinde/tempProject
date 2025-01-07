export function ValpreReactDataTable<T>(props: ValpreReactDataTableProps<T>) {
  if (props.renderMode === 'CSR') {
    const { headers, data, showSearch, pageSize, defaultSortKey, defaultSortDirection, onSortChange } = props;

    return (
      <ClientSideDataTable
        headers={headers}
        data={data}
        showSearch={showSearch}
        pageSize={pageSize}
        defaultSortKey={defaultSortKey}
        defaultSortDirection={defaultSortDirection}
        onSortChange={onSortChange}
      />
    );
  }

  if (props.renderMode === 'SSR') {
    const {
      headers,
      baseUrl,
      createQueryParams = defaultQueryParams, // Provide default implementation
      extractDataFromResponse,
      extractTotalRecordsFromResponse,
      extractTimeFromResponse,
      showSearch,
      pageSize,
      defaultSortKey,
      defaultSortDirection,
      onSortChange,
    } = props;

    if (!baseUrl || !createQueryParams || !extractDataFromResponse || !extractTotalRecordsFromResponse) {
      throw new Error(
        'For SSR, "baseUrl", "createQueryParams", "extractDataFromResponse", and "extractTotalRecordsFromResponse" are required.'
      );
    }

    return (
      <ServerSideDataTable
        headers={headers}
        baseUrl={baseUrl}
        createQueryParams={createQueryParams}
        extractDataFromResponse={extractDataFromResponse}
        extractTotalRecordsFromResponse={extractTotalRecordsFromResponse}
        extractTimeFromResponse={extractTimeFromResponse}
        showSearch={showSearch}
        pageSize={pageSize}
        defaultSortKey={defaultSortKey}
        defaultSortDirection={defaultSortDirection}
        onSortChange={onSortChange}
      />
    );
  }

  return null;
}