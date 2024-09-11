// Import the request function
import { request } from './path-to-your-request-function';

// Mock the global fetch function
global.fetch = jest.fn();

describe('request function', () => {
  
  beforeAll(() => {
    // Refine the FormData mock to fully support expected behaviors
    global.FormData = class {
      private data: Map<string, any> = new Map();
      append(key: string, value: any) {
        this.data.set(key, value);
      }
      get(key: string) {
        return this.data.get(key);
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
});