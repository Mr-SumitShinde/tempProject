import React from 'react';
import { Badge } from "@blueprintjs/core";

interface BadgeRendererProps {
  value: string;  // Assume the value is a string. Adjust the type based on your actual data.
}

const BadgeRenderer: React.FC<BadgeRendererProps> = ({ value }) => {
  return <Badge intent="primary">{value}</Badge>;
};

export default BadgeRenderer;

// Assuming you've already created BadgeRenderer.tsx
import React from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-community/all-modules';
import { ColDef, GridReadyEvent, Module } from '@ag-grid-community/core';
import BadgeRenderer from './BadgeRenderer'; // Import your custom badge cell renderer

const ValpreReactDataTable: React.FC = () => {
  const columnDefs: ColDef[] = [
    {
      headerName: "Status",
      field: "status",
      cellRenderer: 'badgeRenderer',  // Use the BadgeRenderer only for the "Status" column
      width: 150
    },
    {
      headerName: "Name",
      field: "name",
      // Default text renderer will be used here
      width: 200
    },
    // Add other columns as needed...
  ];

  const frameworkComponents = {
    badgeRenderer: BadgeRenderer  // Register the BadgeRenderer component
  };

  const onGridReady = (params: GridReadyEvent) => {
    // You can fetch data here or set up the grid API
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        frameworkComponents={frameworkComponents}
        modules={AllModules as Module[]}
        onGridReady={onGridReady}
        // other necessary grid options
      />
    </div>
  );
};

export default ValpreReactDataTable;