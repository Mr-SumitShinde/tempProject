import React, { useState, useEffect } from 'react';

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
    const [allData, setAllData] = useState({
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
        // Check if we need to fetch data
        if (startItemIndex >= allData.items.length || endItemIndex > allData.items.length || page > allData.lastFetchedPage) {
            setLoading(true);
            setError(null);
            const queryParams = createQueryParams(page, pageSize);
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
            } catch (err) {
                setError(err.message);
                setAllData(prev => ({ ...prev, items: [], totalCount: 0 })); // Reset data on error
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const onPageChange = (newPage: number) => {
        if (newPage < 1 || newPage > Math.ceil(allData.totalCount / pageSize)) return; // Prevent invalid page numbers
        setCurrentPage(newPage);
    };

    const renderCellContent = (item: any, header: any) => {
        return header.render ? header.render(item) : item[header.dataKey];
    };

    const currentData = allData.items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error}</div>;

    return (
        <div>
            <table>
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
                                    {renderCellContent(item, header)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage * pageSize >= allData.totalCount}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ValpreReactDataTable;