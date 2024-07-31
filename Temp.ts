import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ConfigProvider, useConfig } from './ConfigProvider';

const mockConfigData = {
  theme: 'dark',
  language: 'en',
};

const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockConfigData),
  })
);

global.fetch = mockFetch;

const TestComponent: React.FC = () => {
  const { configData, loading, error } = useConfig();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <p>Current Theme: {configData?.theme}</p>
      <p>Language: {configData?.language}</p>
    </div>
  );
};

describe('ConfigProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders config data after loading', async () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => expect(screen.getByText('Current Theme: dark')).toBeInTheDocument());
    expect(screen.getByText('Language: en')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch config data'))
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => expect(screen.getByText('Error: Failed to fetch config data')).toBeInTheDocument());
  });
});