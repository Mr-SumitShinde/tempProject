test('should handle Blob body correctly', async () => {
  const blobData = new Blob(['binary data'], { type: 'application/octet-stream' });

  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    blob: jest.fn().mockResolvedValueOnce(blobData), // Mock the blob method correctly
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

  expect(response).toBe(blobData);
});