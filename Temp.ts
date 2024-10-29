import { renderHook } from '@testing-library/react-hooks';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { useFormWatch, VisibleIfCondition } from './useFormWatch';

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
}));

describe('useFormWatch', () => {
  const mockWatch = jest.fn();
  const mockRegister = jest.fn();
  const mockUnregister = jest.fn();
  const mockSetValue = jest.fn();

  beforeEach(() => {
    (useFormContext as jest.Mock<Partial<UseFormReturn>>).mockReturnValue({
      watch: mockWatch,
      register: mockRegister,
      unregister: mockUnregister,
      setValue: mockSetValue,
    });
    jest.clearAllMocks();
  });

  it('should return true if no visibleIf conditions are provided', () => {
    const { result } = renderHook(() =>
      useFormWatch(undefined, 'testField', {})
    );
    expect(result.current).toBe(true);
  });

  it('should return true if visibleIf is an empty array', () => {
    const { result } = renderHook(() =>
      useFormWatch([], 'testField', {})
    );
    expect(result.current).toBe(true);
  });

  it('should register and unregister the field based on visibility', () => {
    const visibleIfCondition: VisibleIfCondition[] = [
      { key: 'field1', value: 'value1' },
    ];

    mockWatch.mockReturnValueOnce(['value1']);

    const { result } = renderHook(() =>
      useFormWatch(visibleIfCondition, 'testField', {})
    );

    expect(result.current).toBe(true);
    expect(mockUnregister).toHaveBeenCalledWith('testField');
  });

  it('should evaluate `and` conditions correctly', () => {
    const visibleIfCondition: VisibleIfCondition[] = [
      {
        and: [
          { key: 'field1', value: 'value1' },
          { key: 'field2', value: 'value2' },
        ],
      },
    ];

    mockWatch.mockReturnValueOnce(['value1', 'value2']);

    const { result } = renderHook(() =>
      useFormWatch(visibleIfCondition, 'testField', {})
    );

    expect(result.current).toBe(true);
  });

  it('should evaluate `or` conditions correctly', () => {
    const visibleIfCondition: VisibleIfCondition[] = [
      {
        or: [
          { key: 'field1', value: 'value1' },
          { key: 'field2', value: 'value2' },
        ],
      },
    ];

    mockWatch.mockReturnValueOnce(['value1']);

    const { result } = renderHook(() =>
      useFormWatch(visibleIfCondition, 'testField', {})
    );

    expect(result.current).toBe(true);
  });

  it('should set value to null when condition changes to not visible', () => {
    const visibleIfCondition: VisibleIfCondition[] = [
      { key: 'field1', value: 'value1' },
    ];

    mockWatch.mockReturnValueOnce(['differentValue']);

    const { result, rerender } = renderHook(() =>
      useFormWatch(visibleIfCondition, 'testField', {})
    );

    expect(result.current).toBe(false);
    expect(mockRegister).toHaveBeenCalledWith('testField', {});

    mockWatch.mockReturnValueOnce(['value1']);
    rerender();

    expect(mockUnregister).toHaveBeenCalledWith('testField');
    expect(mockSetValue).toHaveBeenCalledWith('testField', null);
  });
});