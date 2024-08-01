// src/FormProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { useConfigContext } from './ConfigProvider';

const FormContext = createContext<any>(null);

export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfigContext();
  const methods = useForm();

  useEffect(() => {
    if (config) {
      methods.reset(config.defaultValues);
    }
  }, [config, methods]);

  return (
    <FormContext.Provider value={methods}>
      <RHFProvider {...methods}>{children}</RHFProvider>
    </FormContext.Provider>
  );
};