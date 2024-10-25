import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ButtonRenderer } from './ButtonRenderer'; // Import your custom cell renderer

const columnDefs = [
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
  buttonRenderer: ButtonRenderer // Map the 'buttonRenderer' identifier to your component
};

// Handler function for button click in the cell
const handleButtonClick = (value) => {
  alert('Button clicked with value: ' + value);
};