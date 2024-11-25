jest.mock('valpre-api-services', () => ({
  valpreAPIGet: jest.fn(() => Promise.reject(new Error('new error'))),
}));