import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { HierarchicalData } from './interfaces';
import '@barclays/blueprint-css/themes/barclays/dist/index.css';
import './valpre-chart.scss';
import {
  BarclaysThemeProvider,
  Section,
  SectionItem,
  Grid,
} from '@barclays/blueprint-react';

interface FlowChartProps {
  data: HierarchicalData[];
  onNodeClick: (node: HierarchicalData) => void;
}

export const FlowChart: React.FC<FlowChartProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 600;
    const nodeHeight = 100;

    const svg = initializeSVG(width, height);
    const root = prepareHierarchy(data);
    const treeLayout = d3.tree<HierarchicalData>().size([600, 400]);
    treeLayout(root);

    drawLinks(svg, root, nodeHeight);
    drawNodes(svg, root, nodeHeight, onNodeClick);
  }, [data, onNodeClick]);

  const initializeSVG = (width: number, height: number) => {
    return d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40,50)');
  };

  const prepareHierarchy = (data: HierarchicalData[]) => {
    return d3
      .stratify<HierarchicalData>()
      .id((d) => d.id)
      .parentId((d) => d.parentId)(data);
  };

  const drawLinks = (svg: any, root: any, nodeHeight: number) => {
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow-up')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 9)
      .attr('refY', 0)
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    svg
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        (d: any) =>
          `M${d.source.x},${d.source.y + nodeHeight / 2}V${
            (d.source.y + d.target.y) / 2
          }H${d.target.x}V${d.target.y + nodeHeight / 2}`
      )
      .attr('marker-end', 'url(#arrow-up)')
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-width', 2);
  };

  const drawNodes = (
    svg: any,
    root: any,
    nodeHeight: number,
    onNodeClick: (node: HierarchicalData) => void
  ) => {
    const node = svg
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => onNodeClick(d.data));

    node
      .append('rect')
      .attr('width', 200)
      .attr('height', 100)
      .attr('x', -100)
      .attr('y', -50)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('class', (d: any) => getNodeColorClass(d.depth));

    addNodeContent(node);
  };

  const getNodeColorClass = (depth: number) => {
    const colors = ['primary', 'success', 'danger', 'warning'];
    return colors[depth % colors.length];
  };

  const addNodeContent = (node: any) => {
    node.each(function (d: any) {
      const nodeGroup = d3.select(this);
      nodeGroup
        .append('foreignObject')
        .attr('width', 30)
        .attr('height', 40)
        .attr('x', -90)
        .attr('y', -6)
        .html(
          `<div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; flex-direction:column; align-items:flex-start; text-align: left">
            <div><img src="../user.png" style="width:20px; height:20px;" alt="NodeImage" /></div>
            <div><img src="../ukflag.png" style="width:20px; height:28px;" alt="FlagImage" /></div>
          </div>`
        );

      const text = nodeGroup.append('text').attr('fill', '#f1f1f1');
      text.append('tspan').attr('x', -90).attr('font-weight', 'bold').text(d.data.id);
      text
        .append('tspan')
        .attr('x', -70)
        .attr('dy', '2em')
        .attr('font-size', '12')
        .text(d.data.line1);
      text
        .append('tspan')
        .attr('x', -70)
        .attr('dy', '2em')
        .attr('font-size', '12')
        .text(d.data.line2);
    });
  };

  return (
    <BarclaysThemeProvider>
      <Section>
        <SectionItem>
          <Grid>
            <svg ref={svgRef}></svg>
          </Grid>
        </SectionItem>
      </Section>
    </BarclaysThemeProvider>
  );
};

export default FlowChart;