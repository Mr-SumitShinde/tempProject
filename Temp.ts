import React from 'react';

interface TableHeaderProps<T> {
  headers: Array<{ title: string; alignment?: 'left' | 'center' | 'right' }>;
}

export const TableHeader = <T,>({ headers }: TableHeaderProps<T>) => (
  <thead>
    <tr>
      {headers.map((header, index) => (
        <th key={index} style={{ textAlign: header.alignment || 'left' }}>
          {header.title}
        </th>
      ))}
    </tr>
  </thead>
);