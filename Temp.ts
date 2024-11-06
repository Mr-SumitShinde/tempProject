interface Item {
    [key: string]: any;  // Define a loose type that can be overridden
}

interface DataState<T> {
    items: T[];
    totalCount: number;
    lastFetchedPage: number;
}

interface ValpreReactDataTableProps<T> {
    baseUrl: string;
    createQueryParams: (page: number, pageSize: number) => string;
    headers: Array<{
        title: string;
        dataKey: string;
        alignment?: 'left' | 'center' | 'right';
        render?: (item: T) => JSX.Element;
    }>;
    initialPage?: number;
    pageSize?: number;
    extractDataFromResponse: (responseData: any) => T[];
    extractTotalRecordsFromResponse: (responseData: any) => number;
}.


const ValpreReactDataTable = <T extends Item>({
    baseUrl,
    createQueryParams,
    headers,
    initialPage = 1,
    pageSize = 10,
    extractDataFromResponse,
    extractTotalRecordsFromResponse
}: ValpreReactDataTableProps<T>) => {
    const [allData, setAllData] = useState<DataState<T>>({
        items: [],
        totalCount: 0,
        lastFetchedPage: 0
    });
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data function and other logic remain the same
    // ...

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
                        {allData.items.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
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
            {/* Pagination and other components */}
        </Section>
    );
};
