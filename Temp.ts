import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

export interface ValpreAPIConfig extends RequestInit {
    url?: string;
    baseURL?: string;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    cancelToken?: {
        signal: AbortSignal;
    };
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
    responseType?: 'json' | 'blob' | 'text' | 'arrayBuffer';
    retries?: number;
    retryDelay?: number;
    retryCondition?: (error: any, attempt: number) => boolean;
    adapter?: (config: ValpreAPIConfig) => Promise<Response>;
    agent?: HttpAgent | HttpsAgent; // Add the agent property
}

export const defaults: ValpreAPIConfig = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    method: 'GET',
    timeout: 0, // Default timeout is 0 (no timeout)
    withCredentials: false,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
};

export function setDefaults(newDefaults: Partial<ValpreAPIConfig>): void {
    Object.assign(defaults, newDefaults);
}