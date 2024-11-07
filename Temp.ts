const [allData, setAllData] = useState({
    items: [],       // Store all fetched items
    totalCount: 0,   // Total count of items from the server
    lastFetchedPage: 0 // Track the last fetched page to manage data fetching
});

const fetchData = async (page) => {
    const startItemIndex = (page - 1) * pageSize;
    const endItemIndex = startItemIndex + pageSize;
    // Check if we need to fetch data or if it's already in the state
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
        } finally {
            setLoading(false);
        }
    }
};

useEffect(() => {
    fetchData(currentPage);
}, [currentPage]); // Depend only on currentPage


const onPageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(allData.totalCount / pageSize)) return; // Prevent invalid page numbers
    setCurrentPage(newPage);
};


const currentData = allData.items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
