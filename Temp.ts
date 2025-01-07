export interface ValpreReactDataTableCSRProps<T> {
  renderMode: 'CSR';
  headers: Header<T>[];
  data: T[];
  showSearch?: boolean;
  pageSize?: number;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
}

export interface ValpreReactDataTableSSRProps<T> {
  renderMode: 'SSR';
  headers: Header<T>[];
  baseUrl: string;
  createQueryParams: (
    page: number,
    offset: number,
    sortKey?: string,
    sortDirection?: 'asc' | 'desc',
    searchQuery?: string
  ) => string;
  extractDataFromResponse: (response: any) => T[];
  extractTotalRecordsFromResponse: (response: any) => number;
  extractTimeFromResponse?: (response: any) => string;
  showSearch?: boolean;
  pageSize?: number;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
}