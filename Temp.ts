import React from 'react';
import { render, screen } from '@testing-library/react';
import FlowChart from './FlowChart';
import '@testing-library/jest-dom';

describe('FlowChart Component', () => {
  test('renders without crashing', () => {
    render(<FlowChart />);
    expect(screen.getByTestId('svg-element')).toBeInTheDocument();
  });

  test('contains an svg element', () => {
    render(<FlowChart />);
    const svgElement = screen.getByTestId('svg-element');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('SVG');
  });
});