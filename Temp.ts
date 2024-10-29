global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    }),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'default',
    url: ''
  }) as Promise<Response>
);