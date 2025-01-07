import React, { useState, useMemo } from 'react';
import { ValpreReactDataTableCSRProps } from './interfaces';

export function ClientSideDataTable<T>({
  headers,
  data,
  showSearch = false,
  pageSize = 10,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSortChange,
}: ValpreReactDataTableCSRProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  // Filter and sort data based on user input
  const filteredAndSortedData = useMemo(() => {
    let filteredData = data;

    if (searchQuery) {
      filteredData = data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortKey) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchQuery, sortKey, sortDirection]);

  // Paginate the filtered and sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const handleSortChange = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    if (onSortChange) onSortChange(key, newDirection);
  };

  return (
    <div>
      {showSearch && (
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      )}

      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => header.sortable && handleSortChange(header.datakey as string)}
                style={{
                  textAlign: header.alignment || 'left',
                  cursor: header.sortable ? 'pointer' : 'default',
                }}
              >
                {header.title}
                {header.sortable && sortKey === header.datakey && (
                  <span style={{ marginLeft: '5px' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{ textAlign: header.alignment || 'left' }}>
                  {header.render ? header.render(item) : item[header.datakey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredAndSortedData.length / pageSize)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev * pageSize < filteredAndSortedData.length ? prev + 1 : prev
            )
          }
          disabled={currentPage * pageSize >= filteredAndSortedData.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}