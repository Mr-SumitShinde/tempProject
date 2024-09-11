test('should handle XML body correctly', async () => {
  const xmlData = `<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>`;

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('XML submitted successfully'),
    headers: {
      get: jest.fn().mockReturnValue('application/xml'),
    },
  });

  const response = await request('POST', 'https://api.example.com/xml', {
    body: xmlData,
    headers: { 'Content-Type': 'application/xml' },
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/xml', {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' },
    body: xmlData,
  });

  expect(response).toBe('XML submitted successfully');
});


test('should handle FormData body correctly', async () => {
  const formData = new FormData();
  formData.append('file', new Blob(['test'], { type: 'text/plain' }));

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('File uploaded successfully'),
    headers: {
      get: jest.fn().mockReturnValue('text/plain'),
    },
  });

  const response = await request('POST', 'https://api.example.com/upload', {
    body: formData,
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/upload', {
    method: 'POST',
    headers: {}, // No Content-Type header is set for FormData
    body: formData,
  });

  expect(response).toBe('File uploaded successfully');
});


test('should handle Blob body correctly', async () => {
  const blobData = new Blob(['binary data'], { type: 'application/octet-stream' });

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('Blob uploaded successfully'),
    headers: {
      get: jest.fn().mockReturnValue('application/octet-stream'),
    },
  });

  const response = await request('POST', 'https://api.example.com/upload-blob', {
    body: blobData,
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/upload-blob', {
    method: 'POST',
    headers: {}, // No Content-Type for Blob
    body: blobData,
  });

  expect(response).toBe('Blob uploaded successfully');
});


test('should handle custom content-type body correctly', async () => {
  const customBody = '<custom>Data</custom>';

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('Custom content-type handled successfully'),
    headers: {
      get: jest.fn().mockReturnValue('application/custom'),
    },
  });

  const response = await request('POST', 'https://api.example.com/custom', {
    body: customBody,
    headers: { 'Content-Type': 'application/custom' },
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/custom' },
    body: customBody,
  });

  expect(response).toBe('Custom content-type handled successfully');
});