useEffect(() => {
  // Initialize something safely
  if (!initialized) {
    initialize();
    setInitialized(true);
  }
  console.log(currentPage);
}, [currentPage]);