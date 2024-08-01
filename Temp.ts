// src/useConfig.ts
import { useState, useEffect } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  defaultValue: any;
  validation?: any;
}

interface Config {
  defaultValues: Record<string, any>;
  fields: FieldConfig[];
}

const useConfig = (configUrl: string) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(configUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Config = await response.json();
        setConfig(data);
        setError(null);
      } catch (err) {
        setError('Failed to load config');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [configUrl]);

  return { config, loading, error };
};

export default useConfig;