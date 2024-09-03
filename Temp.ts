import { ValpreAPI } from '../valpreAPI';
import { InterceptorManager } from '../interceptors';
import { httpAdapter } from '../httpAdapter';

jest.mock('../interceptors');
jest.mock('../httpAdapter');

describe('ValpreAPI', () => {
  let api: ValpreAPI;

  beforeEach(() => {
    api = new ValpreAPI();
  });

  it('should initialize with default settings', () => {
    expect(api.defaults).toBeDefined();
    expect(api.interceptors.request).toBeInstanceOf(InterceptorManager);
    expect(api.interceptors.response).toBeInstanceOf(InterceptorManager);
  });

  it('should allow custom configuration', () => {
    const customConfig = { baseURL: 'https://api.example.com', timeout: 5000 };
    api = new ValpreAPI(customConfig);
    expect(api.defaults.baseURL).toBe('https://api.example.com');
    expect(api.defaults.timeout).toBe(5000);
  });

  it('should use the httpAdapter by default', async () => {
    const config = { url: 'https://api.example.com/test' };
    await api.request(config);
    expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
  });

  it('should use custom adapter if provided', async () => {
    const customAdapter = jest.fn().mockResolvedValue(new Response('test response'));
    api = new ValpreAPI({}, customAdapter);

    const config = { url: 'https://api.example.com/test' };
    const response = await api.request(config);

    expect(customAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
    expect(response).toBeInstanceOf(Response);
  });

  it('should apply request interceptors', async () => {
    const interceptor = jest.fn().mockResolvedValue({ url: 'https://api.example.com/modified' });
    api.interceptors.request.use(interceptor);

    const config = { url: 'https://api.example.com/test' };
    await api.request(config);

    expect(interceptor).toHaveBeenCalledWith(expect.objectContaining(config));
    expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://api.example.com/modified' }));
  });

  it('should apply response interceptors', async () => {
    const responseInterceptor = jest.fn().mockResolvedValue(new Response('modified response'));
    api.interceptors.response.use(responseInterceptor);

    const config = { url: 'https://api.example.com/test' };
    const mockResponse = new Response('original response');
    (httpAdapter as jest.Mock).mockResolvedValue(mockResponse);

    const response = await api.request(config);
    expect(responseInterceptor).toHaveBeenCalledWith(mockResponse);
    expect(response).toBeInstanceOf(Response);
    expect(response.text()).resolves.toBe('modified response');
  });

  it('should handle retry logic', async () => {
    const retryCondition = jest.fn().mockReturnValue(true);
    const config = { url: 'https://api.example.com/test', retries: 1, retryCondition };

    (httpAdapter as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Response('test response'));

    const response = await api.request(config);

    expect(retryCondition).toHaveBeenCalled();
    expect(httpAdapter).toHaveBeenCalledTimes(2); // Retry happened
    expect(response).toBeInstanceOf(Response);
    expect(response.text()).resolves.toBe('test response');
  });

  it('should expose static utility methods', () => {
    expect(ValpreAPI.CancelToken).toBeDefined();
    expect(ValpreAPI.isValpreAPIError).toBeInstanceOf(Function);
    expect(ValpreAPI.create).toBeInstanceOf(Function);
    expect(ValpreAPI.all).toBeInstanceOf(Function);
    expect(ValpreAPI.spread).toBeInstanceOf(Function);
  });
});