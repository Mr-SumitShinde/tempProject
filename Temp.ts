import React from "react";
import { Accordion, AccordionItem, Icon } from "your-library";

interface ValpreDataTableProps {
  icon: string; // Accepting the icon as a string, you can replace it with a specific type if necessary
}

export const ValpreDataTable: React.FC<ValpreDataTableProps> = ({ icon }) => {
  return (
    <>
      <Accordion>
        <AccordionItem id="accordion-item-1">
          <Icon
            aria-hidden="false"
            aria-label="warning"
            icon={icon} // Using the icon prop here
            size="sm"
            status="warning"
            title="Accordion Item 1"
          />
        </AccordionItem>
      </Accordion>
    </>
  );
};