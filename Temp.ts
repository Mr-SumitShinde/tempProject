import React, { useState } from 'react';
import {
  PaginationSimple,
  Section,
  SectionItem,
  Table,
  Type
} from '@barclays/blueprint-react';

const ValpreReactDataTable = ({ data, onPageChange, totalPages, headers }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const renderCellContent = (item, header) => {
    // If a render function is provided, use it to render the content
    if (header.render) {
      return header.render(item);
    }
    // Otherwise, return the data directly
    return item[header.dataKey];
  };

  return (
    <Section>
      <SectionItem>
        <Table headingVariant="secondary" tableHeadNoPaddingBottom>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <Type key={index} alignment={header.alignment} element="th" scope="col" weight={header.weight}>
                  {header.title}
                </Type>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {headers.map((header, idx) => (
                  <Type key={idx} alignment={header.alignment} element="td" weight={header.weight}>
                    {renderCellContent(item, header)}
                  </Type>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionItem>
      <SectionItem>
        <PaginationSimple
          active={currentPage}
          onButtonClick={handlePageChange}
          total={totalPages}
        />
      </SectionItem>
    </Section>
  );
};

export default ValpreReactDataTable;