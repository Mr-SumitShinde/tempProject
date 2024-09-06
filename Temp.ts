import { render } from '@testing-library/react';
import MyComponent from './MyComponent';

// Mock global fetch
global.fetch = jest.fn();

describe('MyComponent', () => {
  const mockProps = { urlParams: { channelId: 'test-channel' } };
  const logoutURL = 'http://example.com/logout';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch when MyComponent is rendered', async () => {
    fetch.mockResolvedValue({ ok: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<MyComponent {...mockProps} />);

    // Expect fetch to be called with the correct parameters
    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'test-channel' },
    });

    // Expect console.log to be called
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it('should handle fetch failure in MyComponent', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<MyComponent {...mockProps} />);

    // Expect fetch to be called
    expect(fetch).toHaveBeenCalled();

    // Expect console.error to be called with the error
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network Error'));
    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId when no urlParams are passed', async () => {
    fetch.mockResolvedValue({ ok: true });

    render(<MyComponent />);

    // Expect fetch to be called with the default channelId
    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'valpre' },
    });
  });
});