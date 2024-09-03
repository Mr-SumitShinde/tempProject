global.Response = jest.fn((body, init) => ({
    body,
    ...init,
    text: () => Promise.resolve(body),
    json: () => {
        try {
            return Promise.resolve(JSON.parse(body));
        } catch (err) {
            if (err instanceof Error) {
                return Promise.reject(new Error('Failed to parse response as JSON: ' + err.message));
            } else {
                return Promise.reject(new Error('Failed to parse response as JSON: Unknown error'));
            }
        }
    },
    headers: new Headers(),
})) as unknown as typeof Response;