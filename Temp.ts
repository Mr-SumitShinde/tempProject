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

  // Handle undefined visibleIf
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
      // Clear the value when the field becomes invisible
      setValue(name, undefined);
    }
  }, [register, unregister, isVisible, name, formElementOptions, setValue]);

  return isVisible;
};

export { useFormWatch };