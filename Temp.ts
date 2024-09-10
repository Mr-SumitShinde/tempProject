import { httpAdapter } from './httpAdapter';
import { ValpreAPIServicesConfig } from './config';

describe('httpAdapter', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Clean up mock after each test
    });

    it('should make a GET request and return a successful response', async () => {
        // Mocking a successful GET request
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => ({ message: 'Success' }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await httpAdapter(config);
        const jsonResponse = await response.json();

        // Assertions
        expect(global.fetch).toHaveBeenCalledTimes(1); // Ensure fetch was called once
        expect(response.status).toBe(200); // Status should be 200
        expect(jsonResponse).toEqual({ message: 'Success' }); // Body should be as expected
    });

    it('should handle a non-JSON response (plain text)', async () => {
        // Mocking a plain text response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            text: async () => 'Plain text response',
            headers: new Headers({ 'Content-Type': 'text/plain' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/text',
            headers: { 'Content-Type': 'text/plain' },
        };

        const response = await httpAdapter(config);
        const textResponse = await response.text();

        // Assertions
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(textResponse).toBe('Plain text response');
    });

    it('should handle POST requests with a JSON body', async () => {
        // Mocking a POST request
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            statusText: 'Created',
            json: async () => ({ id: 1, message: 'Created' }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'POST',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
            body: { name: 'test' }, // Mock POST body
        };

        const response = await httpAdapter(config);
        const jsonResponse = await response.json();

        // Assertions
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(201);
        expect(jsonResponse).toEqual({ id: 1, message: 'Created' });
    });

    it('should handle request timeouts correctly', async () => {
        jest.useFakeTimers();

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' },
        };

        const promise = httpAdapter(config);

        // Fast-forward the timer to simulate a timeout
        jest.advanceTimersByTime(5000);

        await expect(promise).rejects.toThrow('Request timed out');
    });

    it('should handle network errors', async () => {
        // Mocking a network error
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('Network Error');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle HTTP errors (404 Not Found)', async () => {
        // Mocking a 404 error
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ message: 'Not Found' }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/not-found',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('HTTP Error: 404 - Not Found');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});