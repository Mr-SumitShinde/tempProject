import { useEffect } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

// Define the type for visibleIf items
interface VisibleIf {
  key: string;  // The field to watch
  value: string | number | boolean | string[];  // Expected value(s)
}

// Define the type for the hook's props
const useFormWatch = (
  visibleIf: VisibleIf[],  // Array of VisibleIf objects
  name: string,           // Field name
  formElementOptions: any // Form element options
) => {
  const { register, watch, unregister } = useFormContext<FieldValues>();
  const watchFields = visibleIf.map(item => item.key);  // Extract keys
  const watchValues = visibleIf.map(item => item.value);  // Extract values

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