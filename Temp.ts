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
}

// Define the component
const ValpreReactDataTable: React.FC<ValpreReactDataTableProps> = ({
    baseUrl,
    createQueryParams,
    headers,
    initialPage = 1,
    pageSize = 10,
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
            setData(responseData.data.attributes.records);
            setTotalRecords(responseData.data.attributes.totalNoOfRecords);
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

    const renderCellContent = (item: any, header: any) => {
        if (header.render) {
            return header.render(item);
        }
        return item[header.dataKey];
    };

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
                    {data.map((item, index) => (
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
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage * pageSize >= totalRecords}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ValpreReactDataTable;