{showSearch && (
  <SmartSearch
    value={searchInput}
    onSearchChange={(value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }}
    placeholder="Search..."
    debounceDelay={500}
  />
)}



import React, { useState, useEffect } from 'react';

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
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounceDelay, onSearchChange]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
    />
  );
};