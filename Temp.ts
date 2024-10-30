function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

// Example usage
const input = { key1: 'value1', key2: 'value2', key3: 'value3' };
console.log(objectToQueryString(input)); // Output: "key1=value1&key2=value2&key3=value3"