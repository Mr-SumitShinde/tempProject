import React, { useState, useEffect } from 'react';
import { PaginationSimple, Box, Type, Table, Section, SectionItem } from '@barclays/blueprint-react';

interface Item {
    [key: string]: any;  // Generic item definition to support dynamic data structures
}

interface ValpreReactDataTableProps<T> {
    baseUrl: string;
    createQueryParams: (page: number, offSet: number) => string;
    headers: Array<{
        title: string;
        dataKey: keyof T;
        alignment?: 'left' | 'center' | 'right';
        render?: (item: T) => JSX.Element;
    }>;
    initialPage?: number;
    pageSize?: number;
    offSet: number;  // Define how many items to fetch in one API call
    extractDataFromResponse: (responseData: any) => T[];
    extractTotalRecordsFromResponse: (responseData: any) => number;
}

function ValpreReactDataTable<T extends object>({
    baseUrl,
    createQueryParams,
    headers,
    initialPage = 1,
    pageSize = 10,
    offSet,
    extractDataFromResponse,
    extractTotalRecordsFromResponse
}: ValpreReactDataTableProps<T>) {
    const [allData, setAllData] = useState<{
        items: T[];
        totalCount: number;
        lastFetchedPage: number;
    }>({
        items: [],
        totalCount: 0,
        lastFetchedPage: 0
    });

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (page: number) => {
        const startItemIndex = (page - 1) * pageSize;
        const endItemIndex = startItemIndex + pageSize;

        // Check if the data for the requested page is already available
        if (allData.items.length < endItemIndex && page > allData.lastFetchedPage) {
            setLoading(true);
            setError(null);
            const queryParams = createQueryParams(page, offSet);
            const url = `${baseUrl}?${queryParams}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const responseData = await response.json();
                setAllData(prev => ({
                    items: [...prev.items, ...extractDataFromResponse(responseData)],
                    totalCount: extractTotalRecordsFromResponse(responseData),
                    lastFetchedPage: page
                }));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const startItemIndex = (currentPage - 1) * pageSize;
        const endItemIndex = startItemIndex + pageSize;
        if (allData.items.length < endItemIndex && currentPage > allData.lastFetchedPage) {
            fetchData(currentPage);
        }
    }, [currentPage]);

    const onPageChange = (newPage: number) => {
        if (newPage < 1 || newPage > Math.ceil(allData.totalCount / pageSize)) return;
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(allData.totalCount / pageSize);
    const currentData = allData.items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                        {currentData.map((item, index) => (
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
        </Section>
    );
}

export default ValpreReactDataTable;