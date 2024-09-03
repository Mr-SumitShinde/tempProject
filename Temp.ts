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
            run: jest.fn((config) => Promise.resolve(config)),
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
    json: () => Promise.resolve(JSON.parse(body)),
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
        (httpAdapter as jest.Mock).mockResolvedValue(new Response('test response'));

        await api.request(config);

        expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
    });

    it('should use a custom adapter if provided', async () => {
        const customAdapter = jest.fn().mockResolvedValue(new Response('test response'));
        api = new ValpreAPI({}, customAdapter);

        const config = { url: 'https://api.example.com/test' };
        const response = await api.request(config);

        expect(customAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
        expect(response).toBeInstanceOf