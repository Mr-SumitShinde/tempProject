interface ValpreReactDataTableProps<T> {
  baseUrl: string;
  createQueryParams: (page: number, offset: number, sortKey?: string, sortDirection?: 'asc' | 'desc') => string;
  headers: Array<{
    title: string;
    datakey: keyof T;
    alignment?: 'left' | 'center' | 'right';
    render?: (item: T) => JSX.Element;
    sortable?: boolean; // Indicates if this column is sortable
  }>;
  pageSize?: number;
  defaultSortKey?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  extractDataFromResponse: (response: any) => T[];
  extractTotalRecordsFromResponse: (response: any) => number;
  extractTimeFromResponse?: (response: any) => string;
  onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
}