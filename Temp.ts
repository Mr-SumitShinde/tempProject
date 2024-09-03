it('should use the default httpAdapter if no custom adapter is provided', async () => {
    const config = { url: 'https://api.example.com/test' };

    // Mocking httpAdapter to return a valid JSON response
    (httpAdapter as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ message: 'test response' }), {
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
    );

    const response = await api.request(config);

    expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining(config));
    expect(await response.json()).toEqual({ message: 'test response' });
});