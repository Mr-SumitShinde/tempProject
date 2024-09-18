import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const useFormWatch = (
  visibleIf = [], // Array of objects with key-value pairs
  name,
  formElementOptions
) => {
  const { register, watch, unregister } = useFormContext();
  const watchFields = visibleIf.map(item => item.key); // Extract keys
  const watchValues = visibleIf.map(item => item.value); // Extract values

  const watchedValues = watchFields.length > 0 ? watch(watchFields) : [];
  let isVisible = true;

  if (watchFields.length && watchValues.length) {
    isVisible = watchFields.every((field, index) => {
      const expectedValue = watchValues[index];
      const fieldValue = watchedValues[index];
      return Array.isArray(fieldValue)
        ? fieldValue.includes(expectedValue)
        : fieldValue === expectedValue;
    });
  }

  useEffect(() => {
    if (register) {
      if (isVisible) {
        unregister(name);
      } else {
        register(name, formElementOptions);
      }
    }
  }, [register, unregister, isVisible]);

  return isVisible;
};

export { useFormWatch };