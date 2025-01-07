export type ValpreReactDataTableProps<T> =
  | {
      renderMode: 'SSR';
      headers: Header<T>[];
      baseUrl: string;
      createQueryParams: (
        page: number,
        offset: number,
        sortKey?: keyof T,
        sortDirection?: 'asc' | 'desc',
        searchQuery?: string
      ) => string;
      extractDataFromResponse: (response: any) => T[];
      extractTotalRecordsFromResponse: (response: any) => number;
      extractTimeFromResponse?: (response: any) => string;
      showSearch?: boolean;
      pageSize?: number;
      defaultSortKey?: keyof T;
      defaultSortDirection?: 'asc' | 'desc';
      onSortChange?: (sortKey: keyof T, sortDirection: 'asc' | 'desc') => void;
    }
  | {
      renderMode: 'CSR';
      headers: Header<T>[];
      data: T[];
      showSearch?: boolean;
      pageSize?: number;
      defaultSortKey?: keyof T;
      defaultSortDirection?: 'asc' | 'desc';
      onSortChange?: (sortKey: keyof T, sortDirection: 'asc' | 'desc') => void;
    };