import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorHeader } from './ErrorHeader';
import { HeroAlert, Button, Icon, Type } from '@barclays/blueprint-react';

jest.mock('@barclays/blueprint-react', () => ({
  HeroAlert: jest.fn(({ children }) => <div data-testid="hero-alert">{children}</div>),
  Button: jest.fn(({ children }) => <button>{children}</button>),
  Icon: jest.fn(() => <span data-testid="icon" />),
  Type: jest.fn(({ children }) => <div>{children}</div>)
}));

describe('ErrorHeader', () => {
  it('renders the HeroAlert with appropriate content', () => {
    render(<ErrorHeader />);

    expect(screen.getByTestId('hero-alert')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Sorry, something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try after some time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button label' })).toBeInTheDocument();
  });
});