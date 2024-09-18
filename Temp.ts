import { useEffect } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

interface VisibleIf {
  key: string;
  value: string | number | boolean | string[];
}

const useFormWatch = (
  visibleIf: VisibleIf[] | undefined,
  name: string,
  formElementOptions: any
) => {
  const { register, watch, unregister, setValue } = useFormContext<FieldValues>();

  if (!visibleIf || visibleIf.length === 0) {
    useEffect(() => {
      unregister(name);
    }, [unregister, name]);

    return true;
  }

  const watchFields = visibleIf.map(item => item.key);
  const watchValues = visibleIf.map(item => item.value);

  const watchedValues = watch(watchFields);
  let isVisible = true;

  if (watchFields.length && watchValues.length) {
    isVisible = watchFields.every((field, index) => {
      const expectedValue = watchValues[index];
      const fieldValue = watchedValues[index];

      // Check if the value is a Set
      if (fieldValue instanceof Set) {
        return fieldValue.has(expectedValue);
      }

      // If not a Set, handle arrays or single values
      return Array.isArray(fieldValue)
        ? fieldValue.includes(expectedValue)
        : fieldValue === expectedValue;
    });
  }

  useEffect(() => {
    if (isVisible) {
      unregister(name);
    } else {
      register(name, formElementOptions);
      setValue(name, undefined); // Clear the value when the field becomes invisible
    }
  }, [register, unregister, isVisible, name, formElementOptions, setValue]);

  return isVisible;
};

export { useFormWatch };