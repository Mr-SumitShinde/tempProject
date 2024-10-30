import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FlowChart } from './FlowChart';
import { HierarchicalData } from './interfaces';
import * as d3 from 'd3';

describe('FlowChart Component', () => {
  const mockData: HierarchicalData[] = [
    {
      id: '1',
      parentId: null,
      line1: 'Line 1',
      line2: 'Line 2',
      label: 'Label 1',
      formData: {} // Adjust as needed for your interface structure
    },
    {
      id: '2',
      parentId: '1',
      line1: 'Child Line 1',
      line2: 'Child Line 2',
      label: 'Label 2',
      formData: {} // Adjust as needed for your interface structure
    },
  ];

  const mockOnNodeClick = jest.fn();

  beforeEach(() => {
    mockOnNodeClick.mockClear();
  });

  it('renders FlowChart component without crashing', () => {
    render(<FlowChart data={mockData} onNodeClick={mockOnNodeClick} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('initializes SVG correctly', () => {
    render(<FlowChart data={mockData} onNodeClick={mockOnNodeClick} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');
  });

  it('prepares hierarchy data correctly', () => {
    render(<FlowChart data={mockData} onNodeClick={mockOnNodeClick} />);
    const root = d3
      .stratify<HierarchicalData>()
      .id((d) => d.id)
      .parentId((d) => d.parentId)(mockData);

    expect(root.id).toBe('1');
    expect(root.children?.[0].id).toBe('2');
  });

  it('calls onNodeClick when node is clicked', () => {
    render(<FlowChart data={mockData} onNodeClick={mockOnNodeClick} />);
    const nodeRect = screen.getByText('Line 1');
    fireEvent.click(nodeRect);
    expect(mockOnNodeClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders the correct number of nodes', () => {
    render(<FlowChart data={mockData} onNodeClick={mockOnNodeClick} />);
    const nodes = screen.getAllByRole('graphics-document');
    expect(nodes


npm install @testing-library/jest-dom