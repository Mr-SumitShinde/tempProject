import { useEffect } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

interface VisibleIfCondition {
  key?: string;
  value?: string | number | boolean | string[];
  and?: VisibleIfCondition[];
  or?: VisibleIfCondition[];
}

const useFormWatch = (
  visibleIf: VisibleIfCondition[] | undefined,
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

  const watchFields = visibleIf.flatMap(item => collectWatchFields(item));
  const watchedValues = watch(watchFields);

  const evaluateCondition = (condition: VisibleIfCondition): boolean => {
    if (condition.and) {
      return condition.and.every(subCondition => evaluateCondition(subCondition));
    }
    if (condition.or) {
      return condition.or.some(subCondition => evaluateCondition(subCondition));
    }

    const { key, value } = condition;
    if (!key) return false;  // Ensure the key is defined

    const fieldValue = watchedValues[watchFields.indexOf(key)];

    if (fieldValue instanceof Set) {
      return fieldValue.has(value);
    }

    return Array.isArray(fieldValue) ? fieldValue.includes(value) : fieldValue === value;
  };

  let isVisible = visibleIf.every(condition => evaluateCondition(condition));

  function collectWatchFields(condition: VisibleIfCondition): string[] {
    if (condition.and) {
      return condition.and.flatMap(subCondition => collectWatchFields(subCondition));
    }
    if (condition.or) {
      return condition.or.flatMap(subCondition => collectWatchFields(subCondition));
    }
    return condition.key ? [condition.key] : [];  // Return only defined keys
  }

  useEffect(() => {
    if (isVisible) {
      unregister(name);
    } else {
      register(name, formElementOptions);
      setValue(name, null);
    }
  }, [register, unregister, isVisible, name, formElementOptions, setValue]);

  return isVisible;
};

export { useFormWatch, VisibleIfCondition };