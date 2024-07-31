import GenericServiceProvider from './path-to-your-service-provider';

describe('GenericServiceProvider', () => {
  let serviceProvider: GenericServiceProvider;

  beforeEach(() => {
    serviceProvider = new GenericServiceProvider();
  });

  it('should call onSuccess callback with data when fetch is successful', async () => {
    const mockData = { key: 'value' };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const options = { method: 'GET' as 'GET' };
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const callbacks = { onSuccess, onError };

    await serviceProvider.fetchService('mock-url', options, callbacks);

    expect(onSuccess).toHaveBeenCalledWith(mockData);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError callback with error when fetch fails', async () => {
    const mockError = new Error('Fetch error');
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const options = { method: 'GET' as 'GET' };
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const callbacks = { onSuccess, onError };

    await serviceProvider.fetchService('mock-url', options, callbacks);

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError callback with HTTP error when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      json: jest.fn(),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const options = { method: 'GET' as 'GET' };
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const callbacks = { onSuccess, onError };

    await serviceProvider.fetchService('mock-url', options, callbacks);

    expect(onError).toHaveBeenCalledWith(new Error('HTTP error! status: 404'));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError callback with a JSON parsing error', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('JSON parsing error')),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const options = { method: 'GET' as 'GET' };
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const callbacks = { onSuccess, onError };

    await serviceProvider.fetchService('mock-url', options, callbacks);

    expect(onError).toHaveBeenCalledWith(new Error('JSON parsing error'));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});