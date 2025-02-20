import ValpreAPIrequest from '../path/to/ValpreAPIrequest'; // Adjust path accordingly

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('ValpreAPIrequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should make a GET request with correct parameters', async () => {
    await ValpreAPIrequest('GET', 'https://example.com');

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
  });

  test('should include body in POST request', async () => {
    const body = { key: 'value' };
    await ValpreAPIrequest('POST', 'https://example.com', {
      body,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });

  test('should include body in FormData for POST request', async () => {
    const formData = new FormData();
    formData.append('key', 'value');

    await ValpreAPIrequest('POST', 'https://example.com', {
      body: formData,
      headers: {},
    });

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  });

  test('should include body in Blob for PUT request', async () => {
    const blob = new Blob(['test content'], { type: 'text/plain' });

    await ValpreAPIrequest('PUT', 'https://example.com', {
      body: blob,
      headers: { 'Content-Type': 'text/plain' },
    });

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: blob,
    });
  });

  test('should handle DELETE request without body', async () => {
    await ValpreAPIrequest('DELETE', 'https://example.com');

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
  });

  test('should correctly process FormData', async () => {
    const formData = new FormData();
    formData.append('key', JSON.stringify({ name: 'test' }));

    await ValpreAPIrequest('POST', 'https://example.com', {
      body: formData,
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  test('should handle API response correctly', async () => {
    const response = await ValpreAPIrequest('GET', 'https://example.com');
    const json = await response.json();

    expect(json).toEqual({ success: true });
  });
});