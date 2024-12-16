const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey as string | undefined);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(defaultSortDirection);



const fetchData = async (page: number) => {
  const queryParams = createQueryParams(page, pageSize, sortKey, sortDirection);
  const url = baseUrl.includes('?') ? `${baseUrl}&${queryParams}` : `${baseUrl}?${queryParams}`;
  ...
};



export const TableHeader = <T,>({
  headers,
  onSortChange,
  sortKey,
  sortDirection,
}: {
  headers: Array<{ title: string; datakey: keyof T; alignment?: 'left' | 'center' | 'right'; sortable?: boolean }>;
  onSortChange: (key: string) => void;
  sortKey: string | undefined;
  sortDirection: 'asc' | 'desc' | undefined;
}) => (
  <thead>
    <tr>
      {headers.map((header, index) => (
        <th
          key={index}
          style={{ textAlign: header.alignment || 'left', cursor: header.sortable ? 'pointer' : 'default' }}
          onClick={() => header.sortable && onSortChange(header.datakey as string)}
        >
          {header.title}
          {header.sortable && sortKey === header.datakey && (
            <span style={{ marginLeft: '5px' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </th>
      ))}
    </tr>
  </thead>
);



const handleSortChange = (key: string) => {
  const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
  setSortKey(key);
  setSortDirection(newDirection);

  // Notify parent component if needed
  if (onSortChange) {
    onSortChange(key, newDirection);
  }

  // Fetch data with updated sorting
  fetchData(currentPage);
};



<TableHeader
  headers={headers}
  onSortChange={handleSortChange}
  sortKey={sortKey}
  sortDirection={sortDirection}
/>
