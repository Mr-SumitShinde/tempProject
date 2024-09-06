import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

// Mock sessionStorage
const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');

describe('MyComponent', () => {
  describe('when sessionStorage contains user info', () => {
    it('should render the user info', () => {
      // Mock sessionStorage to return some user info
      const mockUserInfo = JSON.stringify({ name: 'John Doe' });
      mockGetItem.mockReturnValue(mockUserInfo);

      // Render the component
      render(<MyComponent />);

      // Expect the user info to be displayed
      expect(screen.getByText('User Info: John Doe')).toBeInTheDocument();
    });
  });

  describe('when sessionStorage does not contain user info', () => {
    it('should render the fallback message', () => {
      // Mock sessionStorage to return null
      mockGetItem.mockReturnValue(null);

      // Render the component
      render(<MyComponent />);

      // Expect the fallback text to be displayed
      expect(screen.getByText('No User Info')).toBeInTheDocument();
    });
  });
});