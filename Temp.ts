export interface ValpreAPIConfig extends RequestInit {
  url?: string;
  params?: Record<string, any>;
  csrfToken?: string;  // No null, only string or undefined
  cancelToken?: {
    signal: AbortSignal;
  };
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  responseType?: 'json' | 'blob' | 'text' | 'arrayBuffer';
  retries?: number;
  retryDelay?: number;
  retryCondition?: (error: any, attempt: number) => boolean;
}

export const defaults: ValpreAPIConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  method: 'GET',
  csrfToken: undefined,  // Or omit this line entirely
};