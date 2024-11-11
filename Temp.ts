import React, { useState, useEffect, useRef } from 'react';

const offset = 100;
const baseUrl = 'https://your-api.com/data';

function DataTable() {
    const hasMounted = useRef(false);
    const [dbPage, setDbPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allData, setAllData] = useState({ items: [], lastFetchedPage: 0, totalCount: 0 });

    const fetchData = async (page) => {
        const startItemIndex = (page - 1) * offset;

        if (allData.items.length < startItemIndex + offset && page > allData.lastFetchedPage) {
            setLoading(true);
            setError(null);
            const queryParams = `page=${page}&offset=${offset}`;
            const url = `${baseUrl}?${queryParams}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();
                const newItems = responseData.data; // Assuming 'data' field in response
                const updatedItems = [...allData.items];

                for (let i = 0; i < newItems.length; i++) {
                    updatedItems[startItemIndex + i] = newItems[i];
                }

                setAllData(prev => ({
                    ...prev,
                    items: updatedItems,
                    lastFetchedPage: page,
                    totalCount: responseData.totalCount
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!hasMounted.current) {
            fetchData(dbPage); // Initial fetch
            hasMounted.current = true;
        }
    }, [dbPage]);

    useEffect(() => {
        const startItemIndex = (currentPage - 1) * offset;
        if (currentPage > allData.lastFetchedPage && allData.items.length < startItemIndex + offset) {
            if (currentPage > Math.ceil(allData.totalCount / offset)) {
                setDbPage(Math.ceil(allData.totalCount / offset));
            } else {
                setDbPage(currentPage);
            }
        }
    }, [currentPage]);

    return (
        <div>
            {/* Render your table and pagination controls here */}
            {error && <p>Error: {error}</p>}
            {isLoading ? <p>Loading...</p> : <p>Data Loaded</p>}
        </div>
    );
}

export default DataTable;