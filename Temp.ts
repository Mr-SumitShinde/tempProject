import { httpAdapter } from './httpAdapter';
import fetchMock from 'fetch-mock';
import { ValpreAPIServicesConfig } from './config';

describe('httpAdapter', () => {
    afterEach(() => {
        fetchMock.restore(); // Clean up mock after each test
    });

    it('should make a GET request and return a successful response', async () => {
        // Mocking a successful GET request
        fetchMock.get('https://mockapi.com/data', {
            status: 200,
            body: { message: 'Success' },
            headers: { 'Content-Type': 'application/json' },
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await httpAdapter(config);
        const jsonResponse = await response.json();

        // Assertions
        expect(fetchMock.calls().length).toBe(1); // Ensure fetch was called once
        expect(response.status).toBe(200); // Status should be 200
        expect(jsonResponse).toEqual({ message: 'Success' }); // Body should be as expected
    });

    it('should handle a non-JSON response (plain text)', async () => {
        // Mocking a plain text response
        fetchMock.get('https://mockapi.com/text', {
            status: 200,
            body: 'Plain text response',
            headers: { 'Content-Type': 'text/plain' },
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/text',
            headers: { 'Content-Type': 'text/plain' },
        };

        const response = await httpAdapter(config);
        const textResponse = await response.text();

        // Assertions
        expect(fetchMock.calls().length).toBe(1);
        expect(response.status).toBe(200);
        expect(textResponse).toBe('Plain text response');
    });

    it('should handle POST requests with JSON body', async () => {
        // Mocking a POST request
        fetchMock.post('https://mockapi.com/data', {
            status: 201,
            body: { id: 1, message: 'Created' },
            headers: { 'Content-Type': 'application/json' },
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
        expect(fetchMock.calls().length).toBe(1);
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
        fetchMock.mock('https://mockapi.com/data', {
            throws: new Error('Network Error'),
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/data',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('Network Error');
        expect(fetchMock.calls().length).toBe(1);
    });

    it('should handle HTTP errors (404 Not Found)', async () => {
        // Mocking a 404 error
        fetchMock.get('https://mockapi.com/not-found', {
            status: 404,
            body: { message: 'Not Found' },
            headers: { 'Content-Type': 'application/json' },
        });

        const config: ValpreAPIServicesConfig = {
            method: 'GET',
            url: 'https://mockapi.com/not-found',
            headers: { 'Content-Type': 'application/json' },
        };

        await expect(httpAdapter(config)).rejects.toThrow('HTTP Error: 404 - Not Found');
        expect(fetchMock.calls().length).toBe(1);
    });
});