// src/DynamicForm.tsx
import React from 'react';
import { useFormContext } from './FormProvider';
import { useConfigContext } from './ConfigProvider';

interface FieldProps {
  field: any;
  register: any;
  error: any;
}

interface DynamicFormProps {
  onSubmit: (data: any) => void;
  onError: (errors: any) => void;
  customFieldComponents?: { [key: string]: React.FC<FieldProps> };
  onClickBack?: () => void;
  clearForm?: () => void;
}

const DefaultField: React.FC<FieldProps> = ({ field, register, error }) => (
  <div>
    <label htmlFor={field.name}>{field.label}</label>
    <input
      id={field.name}
      {...register(field.name, field.validation)}
      type={field.type}
      defaultValue={field.defaultValue}
      aria-invalid={!!error}
      aria-describedby={`${field.name}-error`}
    />
    {error && <span id={`${field.name}-error`}>{error.message}</span>}
  </div>
);

const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit, onError, customFieldComponents = {}, onClickBack, clearForm }) => {
  const { config, loading, error } = useConfigContext();
  const { register, handleSubmit, reset, formState: { errors } } = useFormContext();

  const handleClearForm = () => {
    if (config) {
      reset(config.defaultValues);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!config) {
    return <div>No configuration found</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      {config.fields.map((field) => {
        const FieldComponent = customFieldComponents[field.type] || DefaultField;
        return (
          <FieldComponent
            key={field.name}
            field={field}
            register={register}
            error={errors[field.name]}
          />
        );
      })}
      <button type="submit">Submit</button>
      {onClickBack && <button type="button" onClick={onClickBack}>Back</button>}
      {clearForm && <button type="button" onClick={handleClearForm}>Clear</button>}
    </form>
  );
};

export default DynamicForm;