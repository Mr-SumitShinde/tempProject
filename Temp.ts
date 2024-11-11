const fetchData = async (dbPage: number) => {
  const startItemIndex = (dbPage - 1) * offset;
  const endItemIndex = startItemIndex + offset;

  if (allData.items.length < endItemIndex && dbPage > allData.lastFetchedPage) {
    setLoading(true);
    setError(null);

    const queryParams = createQueryParams(dbPage, offset);
    const url = `${baseUrl}?${queryParams}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      const newItems = extractDataFromResponse(responseData);
      const updatedItems = [...allData.items];

      // Insert the new data at the correct position in the array
      for (let i = 0; i < newItems.length; i++) {
        updatedItems[startItemIndex + i] = newItems[i];
      }

      setAllData((prev) => ({
        ...prev,
        items: updatedItems,
        totalCount: extractTotalRecordsFromResponse(responseData),
        lastFetchedPage: dbPage,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
};



const initialItems = new Array(totalItemCount).fill(undefined);