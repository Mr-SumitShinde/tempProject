import React from 'react';

interface TableBodyProps<T> {
  data: T[];
  headers: Array<{ datakey: keyof T; alignment?: 'left' | 'center' | 'right'; render?: (item: T) => JSX.Element }>;
}

export const TableBody = <T,>({ data, headers }: TableBodyProps<T>) => (
  <tbody>
    {data.length > 0 ? (
      data.map((item, rowIndex) => (
        <tr key={rowIndex}>
          {headers.map((header, colIndex) => (
            <td key={colIndex} style={{ textAlign: header.alignment || 'left' }}>
              {header.render ? header.render(item) : item[header.datakey]?.toString()}
            </td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={headers.length} style={{ textAlign: 'center' }}>
          No data available
        </td>
      </tr>
    )}
  </tbody>
);