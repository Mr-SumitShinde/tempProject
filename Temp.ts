import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConfigData {
  theme: string;
  language: string;
  // Add more configuration properties as needed
}

interface ConfigContextValue {
  configData: ConfigData | null;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export const useConfig = (): ConfigContextValue => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch config data');
        }
        const data: ConfigData = await response.json();
        setConfigData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ configData, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};