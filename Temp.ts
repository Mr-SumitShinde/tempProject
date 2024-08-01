// src/ConfigProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import useConfig from './useConfig';

interface ConfigContextType {
  config: any;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfigContext = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  configUrl: string;
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ configUrl, children }) => {
  const { config, loading, error } = useConfig(configUrl);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};