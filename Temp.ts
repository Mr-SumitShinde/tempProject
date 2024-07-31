type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
};

type FetchCallbacks<T> = {
  onSuccess: (data: T) => void;
  onError: (error: any) => void;
};

class GenericServiceProvider {
  constructor() {}

  public async fetchService<T>(
    url: string,
    options: FetchOptions,
    callbacks: FetchCallbacks<T>
  ): Promise<void> {
    try {
      const response = await fetch(url, { ...options });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: T = await response.json();
      callbacks.onSuccess(data);
    } catch (error) {
      callbacks.onError(error);
    }
  }
}

export default GenericServiceProvider;