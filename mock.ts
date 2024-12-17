import React from 'react';
import { useDebounce } from './useDebounce';

interface SmartSearchProps {
  value: string;
  onSearchChange: (searchValue: string) => void;
  placeholder?: string;
  debounceDelay?: number;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  value,
  onSearchChange,
  placeholder = 'Search...',
  debounceDelay = 500,
}) => {
  const debouncedValue = useDebounce(value, debounceDelay);

  React.useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder}
      style={{
        marginBottom: '10px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
      }}
    />
  );
};


{showSearch && (
  <SmartSearch
    value={searchInput}
    onSearchChange={(value) => {
      setSearchInput(value);
      setSearchQuery(value); // Update search query for API
      setCurrentPage(1);
    }}
    placeholder="Search..."
    debounceDelay={500}
  />
)}