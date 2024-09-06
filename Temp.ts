// Mock global fetch and URL
global.fetch = jest.fn();
const logoutURL = 'http://example.com/logout';

describe('logout function', () => {
  const mockProps = { urlParams: { channelId: 'test-channel' } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch and log response if successful', async () => {
    fetch.mockResolvedValue({ ok: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Call logout directly without importing
    logout(mockProps);

    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'test-channel' }
    });
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it('should log error on fetch failure', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    logout(mockProps);

    expect(fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network Error'));
    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId if no urlParams', async () => {
    fetch.mockResolvedValue({ ok: true });
    
    logout({});
    
    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'valpre' }
    });
  });
});