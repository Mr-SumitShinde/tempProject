test('should handle plain text body correctly', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    text: jest.fn().mockResolvedValueOnce('Text submitted successfully'),
    headers: {
      get: jest.fn().mockReturnValue('text/plain'),
    },
  });

  const response = await request('POST', 'https://api.example.com/text', {
    body: 'This is a plain text message.',
    headers: { 'Content-Type': 'text/plain' },
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/text', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'This is a plain text message.',
  });

  expect(response).toBe('Text submitted successfully');
});