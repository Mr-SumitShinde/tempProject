import React, { useState } from 'react';
import { Box, PaginationSimple, Section, SectionItem, Table, Type } from '@barclays/blueprint-react';

const ValpreReactDataTable = ({ data, onPageChange, totalPages, headers }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        onPageChange(newPage);
    };

    const renderCellContent = (item, header) => {
        if (header.render) {
            return header.render(item);
        }
        return item[header.dataKey];
    };

    return (
        <Section>
            <SectionItem>
                <Table headingVariant="secondary" tableHeadNoPaddingBottom>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <Type
                                    key={index}
                                    alignment={header.alignment}
                                    element="th"
                                    scope="col"
                                    weight={header.weight}
                                >
                                    {header.title}
                                </Type>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, idx) => (
                                    <Type
                                        key={idx}
                                        alignment={header.alignment}
                                        element="td"
                                        weight={header.weight}
                                    >
                                        {renderCellContent(item, header)}
                                    </Type>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </SectionItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Type>
                        Showing 1-10 of 99 items as of 01/11/2024 09:00 AM (GMT+1)
                    </Type>
                </Box>
                <SectionItem>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ border: '2px solid rgb(226, 226, 226)', borderRadius: '28px', width: 'fit-content' }}>
                            <PaginationSimple
                                variant="secondary"
                                active={currentPage}
                                onButtonClick={handlePageChange}
                                total={totalPages}
                            />
                        </div>
                    </div>
                </SectionItem>
            </div>
        </Section>
    );
};

export default ValpreReactDataTable;