it('should handle JSON request transformation', async () => {
    const transformRequest = jest.fn().mockReturnValue(JSON.stringify({ key: 'value' }));
    const config = {
        url: 'https://api.example.com/test',
        method: 'POST',
        body: JSON.stringify({ key: 'value' }), // Convert the body to a JSON string
        transformRequest,
    };

    await api.request(config);

    expect(transformRequest).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'value' }),
        expect.any(Object) // headers
    );
    expect(httpAdapter).toHaveBeenCalledWith(expect.objectContaining({ body: JSON.stringify({ key: 'value' }) }));
});