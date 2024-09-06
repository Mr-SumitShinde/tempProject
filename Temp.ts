import { logout } from './path-to-your-logout-function';

// Mock global fetch
global.fetch = jest.fn();

describe('logout function', () => {
  const mockProps = {
    urlParams: {
      channelId: 'test-channel'
    }
  };

  const logoutURL = 'http://example.com/logout';

  beforeEach(() => {
    // Clear the fetch mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  it('should call fetch with the correct request options and log the response if successful', async () => {
    // Mock the fetch call to resolve with a successful response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    // Spy on console.log to assert it was called
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Call the logout function
    logout(mockProps);

    // Assert that fetch was called with the correct URL and request options
    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'test-channel' }
    });

    // Assert that console.log was called with the response
    expect(consoleLogSpy).toHaveBeenCalled();

    // Restore the console.log spy
    consoleLogSpy.mockRestore();
  });

  it('should handle fetch error and log the error', async () => {
    // Mock the fetch call to reject with an error
    const mockError = new Error('Network Error');
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    // Spy on console.error to assert it was called
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Call the logout function
    logout(mockProps);

    // Assert that fetch was called
    expect(fetch).toHaveBeenCalled();

    // Assert that console.error was called with the error
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    // Restore the console.error spy
    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId if no urlParams are provided', async () => {
    // Mock the fetch call to resolve with a successful response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    // Call the logout function without urlParams
    logout({});

    // Assert that fetch was called with the default channelId
    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'valpre' }
    });
  });
});