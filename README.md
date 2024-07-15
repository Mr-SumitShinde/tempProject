import React, { createContext, useState, useContext, useCallback } from 'react';

// Create a context for the fetch service
const FetchContext = createContext();

export const FetchProvider = ({ children }) => {
  const [controller, setController] = useState(null);

  const fetchService = useCallback(async (url, onResponse, onError) => {
    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch(url, { signal: abortController.signal });
      const data = await response.json();
      onResponse(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        onError(error);
      }
    } finally {
      setController(null);
    }
  }, []);

  const cancelFetch = useCallback(() => {
    if (controller) {
      controller.abort();
    }
  }, [controller]);

  return (
    <FetchContext.Provider value={{ fetchService, cancelFetch }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetch = () => {
  return useContext(FetchContext);
};
