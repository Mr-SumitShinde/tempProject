import React from 'react';
import { useForm } from 'react-hook-form';

const FormWithConditionalRendering = ({ formConfig }) => {
  const { register, handleSubmit, watch } = useForm();
  const formValues = watch(); // Watch all form values

  // Function to determine if a question should be visible
  const shouldRender = (question) => {
    if (!question.visibleIf) return true; // Always render if no visibility condition

    return question.visibleIf.every((condition) => {
      const field = Object.keys(condition)[0];
      const expectedValue = condition[field];

      return formValues[field] === expectedValue || 
             (Array.isArray(formValues[field]) && formValues[field].includes(expectedValue));
    });
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formConfig.map((question) => {
        if (shouldRender(question)) {
          switch (question.type) {
            case 'radio':
              return (
                <div key={question.name}>
                  <label>{question.name}</label>
                  {question.options.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        {...register(question.name)}
                        value={option}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              );
            case 'checkbox':
              return (
                <div key={question.name}>
                  <label>{question.name}</label>
                  {question.options.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        {...register(question.name)}
                        value={option}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              );
            case 'input':
              return (
                <div key={question.name}>
                  <label>{question.name}</label>
                  <input
                    type="text"
                    {...register(question.name)}
                  />
                </div>
              );
            default:
              return null;
          }
        }
        return null; // Don't render if the conditions are not met
      })}

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormWithConditionalRendering;