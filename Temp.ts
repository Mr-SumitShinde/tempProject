// genericServiceProvider.test.ts
import GenericServiceProvider from './genericServiceProvider';

global.fetch = jest.fn();

describe('GenericServiceProvider', () => {
  let serviceProvider: GenericServiceProvider;

  beforeEach(() => {
    serviceProvider = new GenericServiceProvider();
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch data successfully', async () => {
    const mockData = { data: 'test' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    await serviceProvider.fetchService<any>(
      'https://api.example.com/data',
      { method: 'GET' },
      { onSuccess, onError }
    );

    expect(onSuccess).toHaveBeenCalledWith(mockData);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Fetch error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    await serviceProvider.fetchService<any>(
      'https://api.example.com/data',
      { method: 'GET' },
      { onSuccess, onError }
    );

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should handle HTTP error response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    await serviceProvider.fetchService<any>(
      'https://api.example.com/data',
      { method: 'GET' },
      { onSuccess, onError }
    );

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(new Error('HTTP error! status: 404'));
  });

  it('should interrupt fetch request', async () => {
    const mockAbortError = new DOMException('The user aborted a request.', 'AbortError');
    (fetch as jest.Mock).mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(mockAbortError), 100))
    );

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onInterrupt = jest.fn();

    serviceProvider.fetchService<any>(
      'https://api.example.com/data',
      { method: 'GET' },
      { onSuccess, onError, onInterrupt },
      'testInterruptKey'
    );

    serviceProvider.interruptFetch('testInterruptKey');

    await new Promise((r) => setTimeout(r, 150)); // wait for the fetch to be rejected

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onInterrupt).toHaveBeenCalled();
  });
});