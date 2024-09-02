import { ValpreAPIConfig } from '../config';

export function applyCSRFToken(config: ValpreAPIConfig): void {
  if (config.csrfToken) {
    config.headers = {
      ...config.headers,
      'X-CSRF-Token': config.csrfToken,
    };
  }
}



retry

export async function retryRequest(requestFn: () => Promise<Response>, retries: number, delay: number): Promise<Response> {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await requestFn();
    } catch (err) {
      attempts++;
      if (attempts >= retries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}



config


export interface ValpreAPIConfig extends RequestInit {
  url?: string;
  params?: Record<string, any>; // For URL query params
  csrfToken?: string;
  cancelToken?: {
    signal: AbortSignal;
  };
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  responseType?: 'json' | 'blob' | 'text' | 'arrayBuffer';
}

export const defaults: ValpreAPIConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  method: 'GET',
  csrfToken: null,
};



cancle token

export class CancelToken {
  private controller: AbortController;

  constructor(executor: (cancel: () => void) => void) {
    this.controller = new AbortController();
    executor(() => {
      this.controller.abort();
    });
  }

  get signal(): AbortSignal {
    return this.controller.signal;
  }
}


inter sector


export type FulfilledFn<V> = (value: V) => V | Promise<V>;
export type RejectedFn = (error: any) => any;

export class InterceptorManager<V> {
  private handlers: Array<{ fulfilled: FulfilledFn<V>; rejected?: RejectedFn }> = [];

  use(fulfilled: FulfilledFn<V>, rejected?: RejectedFn): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null as any;
    }
  }

  forEach(fn: (handler: { fulfilled: FulfilledFn<V>; rejected?: RejectedFn }) => void): void {
    this.handlers.forEach(handler => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }
}