import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}



const [searchInput, setSearchInput] = useState('');
const debouncedSearchQuery = useDebounce(searchInput, 500);

useEffect(() => {
  setSearchQuery(debouncedSearchQuery);
  setCurrentPage(1);
}, [debouncedSearchQuery]);



<Input
  value={searchInput}
  onChange={(event) => setSearchInput(event.target.value)}
  placeholder="Search..."
  style={{ marginBottom: '10px' }}
/>