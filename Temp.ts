useEffect(() => {
  if (!hasMounted.current) {
    hasMounted.current = true;
  } else {
    const startItemIndex = currentPage * pageSize;
    const endItemIndex = startItemIndex + pageSize;

    if (currentPage > allData.lastFetchedPage && allData.items.length < endItemIndex) {
      let newPage = dbPage;
      if (currentPage === Math.ceil(allData.totalCount / pageSize)) {
        newPage = Math.ceil(allData.totalCount / pageSize);
      } else {
        newPage = dbPage + 1;
      }

      if (newPage !== dbPage) {
        setDbPage(newPage);
      }
    }
  }
}, [currentPage, pageSize, allData, dbPage]);

useEffect(() => {
  fetchData(dbPage);
}, [dbPage]);