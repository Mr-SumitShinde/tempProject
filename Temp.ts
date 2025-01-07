import React from 'react';
import { ValpreReactDataTableProps } from './interfaces';

export function ClientSideDataTable<T>({
  headers,
  showSearch,
  pageSize = 10,
  data: initialData,
}: Omit<ValpreReactDataTableProps<T>, 'renderMode' | 'baseUrl' | 'createQueryParams' | 'extractDataFromResponse' | 'extractTotalRecordsFromResponse' | 'extractTimeFromResponse'> & { data: T[] }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initialData.map((row, index) => (
            <tr key={index}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{row[header.datakey]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}