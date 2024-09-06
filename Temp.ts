import { render } from '@testing-library/react';
import MyComponent from './MyComponent';

// Cast fetch to a Jest mock function
global.fetch = jest.fn() as jest.Mock;

describe('MyComponent', () => {
  const mockProps = { urlParams: { channelId: 'test-channel' } };
  const logoutURL = 'http://example.com/logout';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch when MyComponent is rendered', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<MyComponent {...mockProps} />);

    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'test-channel' },
    });

    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it('should handle fetch failure in MyComponent', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<MyComponent {...mockProps} />);

    expect(fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network Error'));
    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId when no urlParams are passed', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<MyComponent />);

    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'valpre' },
    });
  });
});