test('should handle network error during fetch', async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

  await expect(
    request('GET', 'https://api.example.com/resource')
  ).rejects.toEqual('API GET call error: Network Error');

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/resource', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: undefined,
  });
});


test('should handle unknown content-type response', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('<html></html>'),
    headers: {
      get: jest.fn().mockReturnValue('text/html'),
    },
  });

  const response = await request('GET', 'https://api.example.com/html-response');

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/html-response', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: undefined,
  });

  expect(response).toBe('<html></html>');
});

test('should handle an application/xml response', async () => {
  const mockXMLResponse = `<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>`;

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce(mockXMLResponse),
    headers: {
      get: jest.fn().mockReturnValue('application/xml'),
    },
  });

  const response = await request('GET', 'https://api.example.com/xml');

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/xml', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: undefined,
  });

  expect(response).toBe(mockXMLResponse);
});


test('should handle a POST request with no body', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce({ success: true }),
    headers: {
      get: jest.fn().mockReturnValue('application/json'),
    },
  });

  const response = await request('POST', 'https://api.example.com/resource', {
    headers: { 'Content-Type': 'application/json' },
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/resource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: undefined,
  });

  expect(response).toEqual({ success: true });
});

test('should reject for non-2xx HTTP status codes', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
  });

  await expect(
    request('GET', 'https://api.example.com/error')
  ).rejects.toEqual('Error: 500 - Internal Server Error');

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/error', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: undefined,
  });
});


test('should handle application/octet-stream response as Blob', async () => {
  const mockBlob = new Blob(['binary data']);

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