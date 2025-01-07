import React, { useState, useMemo } from 'react';

export function ClientSideDataTable({ data, headers, pageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredData = useMemo(() => {
    let filtered = data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortKey) {
      filtered.sort((a, b) =>
        sortDirection === 'asc' ? (a[sortKey] > b[sortKey] ? 1 : -1) : (a[sortKey] < b[sortKey] ? 1 : -1)
      );
    }
    return filtered;
  }, [data, searchQuery, sortKey, sortDirection]);

  const displayedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key} onClick={() => handleSort(header.key)}>
                {header.label} {sortKey === header.key ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header.key}>{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => (prev * pageSize < filteredData.length ? prev + 1 : prev))}
        >
          Next
        </button>
      </div>
    </div>
  );
}