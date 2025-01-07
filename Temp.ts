export interface ValpreReactDataTableProps<T> {
  renderMode: 'SSR' | 'CSR';
  headers: Header<T>[];
  showSearch?: boolean;
  pageSize?: number;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
  baseUrl?: string;
  createQueryParams?: (
    page: number,
    offset: number,
    sortKey?: string,
    sortDirection?: 'asc' | 'desc',
    searchQuery?: string
  ) => string;
  extractDataFromResponse?: (response: any) => T[];
  extractTotalRecordsFromResponse?: (response: any) => number;
  extractTimeFromResponse?: (response: any) => string;
  data?: T[];
}

export interface Header<T> {
  title: string;
  dataKey: keyof T;
  sortable?: boolean;
  alignment?: 'left' | 'center' | 'right';
}