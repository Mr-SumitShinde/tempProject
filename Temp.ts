import React, { useState, useMemo } from 'react';
import { ValpreReactDataTableProps } from './interfaces';

export function ClientSideDataTable<T>({
  headers,
  showSearch = false,
  pageSize = 10,
  data: initialData = [],
}: ValpreReactDataTableProps<T> & { data: T[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let filtered = initialData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortKey) {
      filtered.sort((a, b) =>
        sortDirection === 'asc'
          ? a[sortKey] > b[sortKey]
            ? 1
            : -1
          : a[sortKey] < b[sortKey]
          ? 1
          : -1
      );
    }
    return filtered;
  }, [initialData, searchQuery, sortKey, sortDirection]);

  const displayedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
  };

  return (
    <div>
      {/* Search */}
      {showSearch && (
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

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
        <span>
          Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev * pageSize < filteredData.length ? prev + 1 : prev))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}