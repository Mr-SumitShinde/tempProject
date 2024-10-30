function getQueryStringFromFilterModel(filterModel: Record<string, any> | null): string {
  const filters: Record<string, any> = {};

  if (filterModel != null) {
    Object.keys(filterModel).forEach((field) => {
      filters[field] = filterModel[field].filter;
    });
  }

  return Object.keys(filters)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
    .join('&');
}

// Example usage
const filterModel = {
  key1: { filter: 'value1' },
  key2: { filter: 'value2' },
  key3: { filter: 'value3' }
};

console.log(getQueryStringFromFilterModel(filterModel));
// Output: "key1=value1&key2=value2&key3=value3"