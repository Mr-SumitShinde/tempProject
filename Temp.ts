import { httpAdapter } from './httpAdapter';
import { ValpreAPIServicesConfig } from './config';

describe('httpAdapter', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Clean up after each test
    });

    it('should make a GET request and return a successful response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            text: async () => 'Success',
            headers: new Headers({ 'Content-Type': 'text/plain' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await httpAdapter(config);
        const textResponse = await response.text();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(textResponse).toBe('Success');
    });

    it('should handle POST requests with a JSON body', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            statusText: 'Created',
            text: async () => JSON.stringify({ id: 1, message: 'Created' }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'POST',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test' }),
        };

        const response = await httpAdapter(config);
        const jsonResponse = await response.json();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(201);
        expect(jsonResponse).toEqual({ id: 1, message: 'Created' });
    });

    it('should handle a timeout correctly', async () => {
        jest.useFakeTimers();

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' },
        };

        const promise = httpAdapter(config);

        jest.advanceTimersByTime(5000);

        await expect(promise).rejects.toThrow('Request timed out');
    });

    it('should handle network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('Network Error');
    });

    it('should handle HTTP errors (404 Not Found)', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            text: async () => JSON.stringify({ message: 'Not Found' }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/not-found',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('HTTP Error: 404 - Not Found');
    });
});