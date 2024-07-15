import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FetchResponse {
  data: any;
  status: number;
}

interface FetchError {
  error: any;
  status: number;
}

interface ServiceProviderProps {
  children: ReactNode;
}

interface ServiceContextProps {
  fetchService: (
    url: string,
    method?: string,
    body?: any,
    headers?: HeadersInit
  ) => void;
  interrupt: () => void;
  responseCallback?: (response: FetchResponse) => void;
  errorCallback?: (error: FetchError) => void;
  setResponseCallback: (callback: (response: FetchResponse) => void) => void;
  setErrorCallback: (callback: (error: FetchError) => void) => void;
}

const ServiceContext = createContext<ServiceContextProps | undefined>(undefined);

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [responseCallback, setResponseCallback] = useState<(response: FetchResponse) => void>();
  const [errorCallback, setErrorCallback] = useState<(error: FetchError) => void>();

  const fetchService = async (
    url: string,
    method: string = 'GET',
    body?: any,
    headers: HeadersInit = { 'Content-Type': 'application/json' }
  ) => {
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      const data = await response.json();
      if (response.ok) {
        responseCallback && responseCallback({ data, status: response.status });
      } else {
        errorCallback && errorCallback({ error: data, status: response.status });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        errorCallback && errorCallback({ error, status: 500 });
      }
    } finally {
      setAbortController(null);
    }
  };

  const interrupt = () => {
    abortController && abortController.abort();
  };

  return (
    <ServiceContext.Provider
      value={{
        fetchService,
        interrupt,
        responseCallback,
        errorCallback,
        setResponseCallback,
        setErrorCallback,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = (): ServiceContextProps => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};
