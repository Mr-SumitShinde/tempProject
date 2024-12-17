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