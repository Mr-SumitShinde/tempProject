import React from 'react';

interface ButtonRendererProps {
  value: any; // You might want to be more specific depending on what `value` is expected to be
  onClick: (value: any) => void;
}

const ButtonRenderer: React.FC<ButtonRendererProps> = ({ value, onClick }) => {
  return (
    <button onClick={() => onClick(value)}>
      Click Me
    </button>
  );
};

export default ButtonRenderer;

import React from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-community/all-modules';
import { ColDef, GridReadyEvent, Module } from '@ag-grid-community/core';
import ButtonRenderer from './ButtonRenderer'; // Import your custom cell renderer

const ValpreReactDataTable: React.FC = () => {
  const columnDefs: ColDef[] = [
    {
      headerName: "Button",
      field: "action",
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: handleButtonClick
      },
      width: 150
    },
    // other columns...
  ];

  const frameworkComponents = {
    buttonRenderer: ButtonRenderer
  };

  const handleButtonClick = (value: any) => {
    alert('Button clicked with value: ' + value);
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