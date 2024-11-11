const offset: number = 100;
const pageSize: number = offset; // Assuming pageSize and offset are the same

const hasMounted = useRef(false);

const [dbPage, setDbPage] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [isLoading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Mock of allData to illustrate example
const allData = {
    items: [], // Array of data items
    lastFetchedPage: 0,
    totalCount: 1000 // Total count of items in the dataset
};

const fetchData = async (dbPage: number) => {
    // Fetching logic here
};

useEffect(() => {
    if (!hasMounted.current) {
        hasMounted.current = true;
        fetchData(dbPage); // Initial fetch
    } else {
        const startItemIndex = (currentPage - 1) * pageSize;
        const endItemIndex = startItemIndex + pageSize;

        if (currentPage > allData.lastFetchedPage && allData.items.length < endItemIndex) {
            if (currentPage === Math.ceil(allData.totalCount / pageSize)) {
                setDbPage(Math.ceil(allData.totalCount / offset));
            } else {
                setDbPage(dbPage + 1);
            }
        }
    }
}, [currentPage]);

useEffect(() => {
    fetchData(dbPage);
}, [dbPage]);