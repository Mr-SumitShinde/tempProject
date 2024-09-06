import { render, fireEvent } from '@testing-library/react';
import Header from './Header'; // Adjust the import path if necessary

// Cast fetch to a Jest mock function
global.fetch = jest.fn() as jest.Mock;

describe('Header component', () => {
  const mockProps = { urlParams: { channelId: 'test-channel' } };
  const logoutURL = 'http://example.com/logout';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch when Log out button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Render the Header component
    const { getByText } = render(<Header {...mockProps} />);

    // Simulate a button click
    fireEvent.click(getByText('Log out'));

    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'test-channel' },
    });

    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it('should handle fetch failure when Log out button is clicked', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Render the Header component
    const { getByText } = render(<Header {...mockProps} />);

    // Simulate a button click
    fireEvent.click(getByText('Log out'));

    expect(fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network Error'));
    consoleErrorSpy.mockRestore();
  });

  it('should use default channelId when Log out button is clicked with no urlParams', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    // Render the Header component without props
    const { getByText } = render(<Header />);

    // Simulate a button click
    fireEvent.click(getByText('Log out'));

    expect(fetch).toHaveBeenCalledWith(logoutURL, {
      method: 'GET',
      headers: { channelid: 'valpre' },
    });
  });
});