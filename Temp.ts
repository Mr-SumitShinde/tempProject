import React from 'react';
import { ConfigProvider } from './ConfigProvider';
import { FormProvider } from './FormProvider';
import DynamicForm from './DynamicForm';
import { useNavigate } from 'react-router-dom'; // Updated to use useNavigate from react-router-dom

const App: React.FC = () => {
  const navigate = useNavigate(); // Updated to use useNavigate

  const handleOnSubmit = (data: any) => {
    console.log('Form Submitted Successfully:', data);
    // Your form submission logic here
  };

  const handleOnError = (errors: any) => {
    console.log('Form Submission Errors:', errors);
    // Your error handling logic here
  };

  const handleOnClickBack = () => {
    navigate('/previous-page'); // Replace with your desired back URL
  };

  const handleClearForm = () => {
    console.log('Form cleared');
    // The form will be reset automatically
  };

  const CustomTextField: React.FC<FieldProps> = ({ field, register, error }) => (
    <div>
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        {...register(field.name, field.validation)}
        type="text"
        defaultValue={field.defaultValue}
        aria-invalid={!!error}
        aria-describedby={`${field.name}-error`}
      />
      {error && <span id={`${field.name}-error`}>{error.message}</span>}
    </div>
  );

  return (
    <ConfigProvider configUrl="https://example.com/form-config">
      <FormProvider>
        <DynamicForm
          onSubmit={handleOnSubmit}
          onError={handleOnError}
          onClickBack={handleOnClickBack}
          clearForm={handleClearForm}
          customFieldComponents={{ text: CustomTextField }}
        />
      </FormProvider>
    </ConfigProvider>
  );
};

export default App;