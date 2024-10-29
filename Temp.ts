global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    }),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'default',
    url: ''
  }) as Promise<Response>
);


// At the top of your test file
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ValpreReactDataTable from './ValpreReactDataTable';
import '@testing-library/jest-dom/extend-expect';

// Type casting fetch as a jest.Mock to satisfy TypeScript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      totalRowCount: 100,
      rows: [{ id: 1, name: 'Item 1' }]
    })
  })
) as jest.Mock;

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});