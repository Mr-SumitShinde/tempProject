import { render, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header'; // Adjust the import path if necessary

// Cast fetch to a Jest mock function
global.fetch = jest.fn() as jest.Mock;

describe('Header component', () => {
  const mockProps = { urlParams: { channelId: 'test-channel' } };
  const logoutURL = 'http://example.com/logout';

  beforeEach(() => {
    jest.clearAllMocks(); // Ensure all mocks are cleared between tests
  });

  it('should call fetch when Log out button is clicked', async () => {
    // Mock fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Render the Header component
    const { getByText } = render(<Header {...mockProps} />);

    // Simulate button click
    fireEvent.click(getByText('Log out'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(logoutURL, {
        method: 'GET',
        headers: { channelid: 'test-channel' },
      });

      expect(consoleLogSpy).toHaveBeenCalled(); // Ensure console.log was called
    });

    consoleLogSpy.mockRestore();
  });

  it('should handle fetch failure when Log out button is clicked', async () => {
    // Mock fetch rejection (failure)
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Render the Header component
    const { getByText } = render(<Header {...mockProps} />);

    // Simulate button click
    fireEvent.click(getByText('Log out'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();

      // Ensure console.error was called with the expected error
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network Error'));
    });

    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId when Log out button is clicked with no urlParams', async () => {
    // Mock fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    // Render the Header component without props
    const { getByText } = render(<Header />);

    // Simulate button click
    fireEvent.click(getByText('Log out'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(logoutURL, {
        method: 'GET',
        headers: { channelid: 'valpre' },
      });
    });
  });
});