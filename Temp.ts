import React, { useState, useEffect } from 'react';
import { PaginationSimple, Box, Type, Table, Section, SectionItem } from '@barclays/blueprint-react'; // Import necessary components

// Define types for props
interface ValpreReactDataTableProps {
    baseUrl: string;
    createQueryParams: (page: number, pageSize: number) => string;
    headers: Array<{
        title: string;
        dataKey: string;
        alignment?: 'left' | 'center' | 'right';
        render?: (item: any) => JSX.Element;
    }>;
    initialPage?: number;
    pageSize?: number;
    extractDataFromResponse: (responseData: any) => any[];
    extractTotalRecordsFromResponse: (responseData: any) => number;
}

// Define the component
const ValpreReactDataTable: React.FC<ValpreReactDataTableProps> = ({
    baseUrl,
    createQueryParams,
    headers,
    initialPage = 1,
    pageSize = 10,
    extractDataFromResponse,
    extractTotalRecordsFromResponse
}) => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (page: number) => {
        setLoading(true);
        setError(null);
        const queryParams = createQueryParams(page, pageSize);
        const url = `${baseUrl}?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            setData(extractDataFromResponse(responseData));
            setTotalRecords(extractTotalRecordsFromResponse(responseData));
        } catch (err: any) {
            setError(err.message);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, baseUrl, pageSize]);

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error}</div>;

    return (
        <Section>
            <SectionItem>
                <Table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} style={{ textAlign: header.alignment || 'left' }}>
                                    {header.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, idx) => (
                                    <td key={idx} style={{ textAlign: header.alignment || 'left' }}>
                                        {header.render ? header.render(item) : item[header.dataKey]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </SectionItem>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Type>Showing items for page {currentPage} of {totalPages}</Type>
                <PaginationSimple
                    variant="secondary"
                    active={currentPage}
                    onButtonClick={onPageChange}
                    total={totalPages}
                />
            </Box>
            <div style={{ marginTop: '20px', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '5px' }}>
                <Type element="p" typeStyle="bodyLarge">This is additional informational text that helps users understand table data or context better.</Type>
            </div>
        </Section>
    );
};

export default ValpreReactDataTable;