// genericServiceProvider.ts

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
};

type FetchCallbacks<T> = {
  onSuccess: (data: T) => void;
  onError: (error: any) => void;
  onInterrupt?: () => void;
};

class GenericServiceProvider {
  private abortControllers: Map<string, AbortController>;

  constructor() {
    this.abortControllers = new Map();
  }

  private createAbortController(key: string): AbortController {
    const abortController = new AbortController();
    this.abortControllers.set(key, abortController);
    return abortController;
  }

  private removeAbortController(key: string): void {
    this.abortControllers.delete(key);
  }

  public async fetchService<T>(
    url: string,
    options: FetchOptions,
    callbacks: FetchCallbacks<T>,
    interruptKey?: string
  ): Promise<void> {
    const controller = interruptKey ? this.createAbortController(interruptKey) : new AbortController();
    const { signal } = controller;

    try {
      const response = await fetch(url, { ...options, signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: T = await response.json();
      callbacks.onSuccess(data);
    } catch (error) {
      if (signal.aborted) {
        callbacks.onInterrupt?.();
      } else {
        callbacks.onError(error);
      }
    } finally {
      if (interruptKey) {
        this.removeAbortController(interruptKey);
      }
    }
  }

  public interruptFetch(key: string): void {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
    }
  }
}

export default GenericServiceProvider;

import React, { useEffect } from 'react';
import GenericServiceProvider from './genericServiceProvider';

const MyComponent: React.FC = () => {
  const serviceProvider = new GenericServiceProvider();

  useEffect(() => {
    const fetchData = async () => {
      await serviceProvider.fetchService<any>(
        'https://api.example.com/data',
        { method: 'GET' },
        {
          onSuccess: (data) => {
            console.log('Data fetched successfully:', data);
          },
          onError: (error) => {
            console.error('Error fetching data:', error);
          },
          onInterrupt: () => {
            console.log('Fetch request interrupted.');
          }
        },
        'fetchDataKey'
      );
    };

    fetchData();

    return () => {
      serviceProvider.interruptFetch('fetchDataKey');
    };
  }, [serviceProvider]);

  return <div>My Component</div>;
};

export default MyComponent;

