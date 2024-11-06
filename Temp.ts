import React, { useState, useEffect } from 'react';
import { Box, PaginationSimple, Section, SectionItem, Table, Type } from '@barclays/blueprint-react';

const ValpreReactDataTable = ({
    baseUrl,
    createQueryParams,
    headers,
    initialPage = 1,
    pageSize = 100,
    rowsPerPage = 10
}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async (page) => {
        const queryParams = createQueryParams ? createQueryParams(page, pageSize) : `page=${page}&size=${pageSize}`;
        const url = `${baseUrl}?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            setData(responseData.items);
            setTotalPages(Math.ceil(responseData.totalItems / rowsPerPage));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setData([]);
            setTotalPages(0);
        }
    };

    useEffect(() => {
        const dataPage = Math.ceil(currentPage * rowsPerPage / pageSize);
        fetchData(dataPage);
    }, [currentPage, baseUrl, pageSize, rowsPerPage]);

    const onPageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const renderCellContent = (item, header) => {
        if (header.render) {
            return header.render(item);
        }
        return item[header.dataKey];
    };

    const displayData = data.slice((currentPage - 1) % totalPages * rowsPerPage, currentPage % totalPages * rowsPerPage);

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
                        {displayData.map((item, index) => (
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
            <div style={{ display: 'flex', justifyContents: 'space-between' }}>
                <Box>
                    <Type>
                        Showing items for page {currentPage}
                    </Type>
                </Box>
                <SectionItem>
                    <div style={{ display: 'flex', justifyContents: 'flex-end' }}>
                        <div style={{ border: '2px solid rgb(226, 226, 226)', borderRadius: '28px', width: 'fit-content' }}>
                            <PaginationSimple
                                variant="secondary"
                                active={currentPage}
                                onButtonClick={onPageChange}
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