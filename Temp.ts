// Import the request function
import { request } from './path-to-your-request-function';

// Mock the global fetch function
global.fetch = jest.fn();

describe('request function', () => {
  
  beforeAll(() => {
    // Mock FormData
    global.FormData = class {
      private data: { [key: string]: any } = {};
      append(key: string, value: any) {
        this.data[key] = value;
      }
      getMockData() {
        return this.data;
      }
    } as unknown as typeof FormData;

    // Mock Blob
    global.Blob = class {
      private content: any;
      constructor(content: any) {
        this.content = content;
      }
    } as unknown as typeof Blob;
  });

  beforeEach(() => {
    (fetch as jest.Mock).mockClear(); // Clear mocks before each test
  });

  test('should perform a POST request with JSON payload', async () => {
    const mockResponse = { id: 1, name: 'John Doe' };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
    });

    const response = await request('POST', 'https://api.example.com/resource', {
      body: { name: 'John Doe' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe' }),
    });

    expect(response).toEqual(mockResponse);
  });

  test('should handle a GET request without a body', async () => {
    const mockResponse = { name: 'John Doe' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
    });

    const response = await request('GET', 'https://api.example.com/resource');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/resource', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });

    expect(response).toEqual(mockResponse);
  });

  test('should handle an error response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(
      request('GET', 'https://api.example.com/non-existent')
    ).rejects.toEqual('Error: 404 - Not Found');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/non-existent', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
  });

  test('should handle a PUT request with FormData', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'text/plain' }));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce('File uploaded'),
      headers: {
        get: jest.fn().mockReturnValue('text/plain'),
      },
    });

    const response = await request('PUT', 'https://api.example.com/upload', {
      body: formData,
    });

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/upload', {
      method: 'PUT',
      headers: {}, // No Content-Type for FormData
      body: formData,
    });

    expect(response).toEqual('File uploaded');
  });

  test('should handle a DELETE request', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce('Resource deleted'),
      headers: {
        get: jest.fn().mockReturnValue('text/plain'),
      },
    });

    const response = await request('DELETE', 'https://api.example.com/resource');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/resource', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });

    expect(response).toEqual('Resource deleted');
  });

  test('should handle response as Blob', async () => {
    const mockBlob = new Blob(['test blob']);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: jest.fn().mockResolvedValueOnce(mockBlob),
      headers: {
        get: jest.fn().mockReturnValue('application/octet-stream'),
      },
    });

    const response = await request('GET', 'https://api.example.com/file');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/file', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });

    expect(response).toBe(mockBlob);
  });

  test('should handle plain text response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce('Plain text response'),
      headers: {
        get: jest.fn().mockReturnValue('text/plain'),
      },
    });

    const response = await request('GET', 'https://api.example.com/text');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/text', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });

    expect(response).toBe('Plain text response');
  });
});