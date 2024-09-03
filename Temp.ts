import { ValpreAPI } from '../valpreAPI';
import { httpAdapter } from '../httpAdapter';
import { InterceptorManager } from '../interceptors';

// Mocking the httpAdapter and InterceptorManager
jest.mock('../httpAdapter');
jest.mock('../interceptors', () => {
    const actualInterceptors = jest.requireActual('../interceptors');
    return {
        InterceptorManager: jest.fn().mockImplementation(() => ({
            use: jest.fn(),
            eject: jest.fn(),
            run: jest.fn((config) => Promise.resolve(config)), // Mock run to return the config unchanged
        })),
        ...actualInterceptors,
    };
});

// Mocking the global Headers and Response objects for Node.js environment
global.Headers = jest.fn(() => ({
    append: jest.fn(),
    get: jest.fn().mockImplementation((name) => {
        switch (name) {
            case 'Content-Type':
                return 'application/json';
            default:
                return null;
        }
    }),
})) as unknown as typeof Headers;

global.Response = jest.fn((body, init) => ({
    body,
    ...init,
    text: () => Promise.resolve(body),
    json: () => {
        try {
            return Promise.resolve(JSON.parse(body));
        } catch (err) {
            return Promise.reject(new Error('Failed to parse response as JSON: ' + err.message));
        }
    },
    headers: new Headers(),
})) as unknown as typeof Response;

describe('ValpreAPI', () => {
    let api: ValpreAPI;

    beforeEach(() => {
        jest.clearAllMocks();
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

    it('should use the default httpAdapter if no custom adapter is provided', async () => {
        const config = { url: 'https://api.example.com/test' };
        (httpAdapter as jest.Mock).mockResolvedValue(new Response(JSON.stringify({ data: 'test response' })));

        await api.request(config);

        expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
    });

    it('should use a custom adapter if provided', async () => {
        const customAdapter = jest.fn().mockResolvedValue(new Response(JSON.stringify({ data: 'test response' })));
        api = new ValpreAPI({}, customAdapter);

        const config = { url: 'https://api.example.com/test' };
        const response = await api.request(config);

        expect(customAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
        expect(response).toBeInstanceOf(Response);
        expect(await response.json()).toEqual({ data: 'test response' });
    });

    it('should apply request interceptors', async () => {
        const interceptor = jest.fn().mockResolvedValue({ url: 'https://api.example.com/modified' });
        api.interceptors.request.use(interceptor);

        const config = { url: 'https://api.example.com/test' };
        (httpAdapter as jest.Mock).mockResolvedValue(new Response(JSON.stringify({ data: 'test response' })));

        await api.request(config);

        expect(interceptor).toHaveBeenCalledWith(expect.objectContaining(config));
        expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://api.example.com/modified' }));
    });

    it('should apply response interceptors', async () => {
        const responseInterceptor = jest.fn().mockResolvedValue(new Response(JSON.stringify({ data: 'modified response' })));
        api.interceptors.response.use(responseInterceptor);

        const config = { url: 'https://api.example.com/test' };
        const mockResponse = new Response(JSON.stringify({ data: 'original response' }));
        (httpAdapter as jest.Mock).mockResolvedValue(mockResponse);

        const response = await api.request(config);

        expect(responseInterceptor).toHaveBeenCalledWith(mockResponse);
        expect(response).toBeInstanceOf(Response);
        expect(await response.json()).toEqual({ data: 'modified response' });
    });

    it('should handle retry logic', async () => {
        const retryCondition = jest.fn().mockReturnValue(true);
        const config = { url: 'https://api.example.com/test', retries: 1, retryCondition };

        (httpAdapter as jest.Mock)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test response' })));

        const response = await api.request(config);

        expect(retryCondition).toHaveBeenCalled();
        expect(httpAdapter).toHaveBeenCalledTimes(2); // Retry happened
        expect(response).toBeInstanceOf(Response);
        expect(await response.json()).toEqual({ data: 'test response' });
    });

    it('should expose static utility methods', () => {
        expect(ValpreAPI.CancelToken).toBeDefined();
        expect(ValpreAPI.isValpreAPIError).toBeInstanceOf(Function);
        expect(ValpreAPI.create).toBeInstanceOf(Function);
        expect(ValpreAPI.all).toBeInstanceOf(Function);
        expect(ValpreAPI.spread).toBeInstanceOf(Function);
    });

    it('should handle request with progress tracking', async () => {
        const onUploadProgress = jest.fn();
        const onDownloadProgress = jest.fn();

        const config = {
            url: 'https://api.example.com/test',
            onUploadProgress,
            onDownloadProgress,
        };

        (http