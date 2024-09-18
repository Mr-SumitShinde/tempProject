import { useEffect } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

interface VisibleIf {
  key: string;
  value: string | number | boolean | string[];
}

const useFormWatch = (
  visibleIf: VisibleIf[] | undefined,  // visibleIf can now be undefined
  name: string,
  formElementOptions: any
) => {
  const { register, watch, unregister } = useFormContext<FieldValues>();

  // Handle undefined visibleIf
  if (!visibleIf || visibleIf.length === 0) {
    // If visibleIf is undefined or empty, always return true (field is visible)
    useEffect(() => {
      if (register) {
        unregister(name);
      }
    }, [register, unregister]);

    return true;
  }

  const watchFields = visibleIf.map(item => item.key);
  const watchValues = visibleIf.map(item => item.value);

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