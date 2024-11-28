useEffect(() => {
  const fetchData = async () => {
    const queryParams = { refreshStatus: 'Y', generateLink: 'N' };
    const url = urlGen(queryParams);

    valpreAPIGet(url, requestOptions)
      .then(async (response) => {
        await setCaseDetailsData(response);

        if (caseStatus === 'AWAITING INPUT') {
          setGenlinkFlag(true);
        }

        window.scrollTo(0, document.body.scrollHeight);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
        setErrorFlag(true);
      });
  };

  fetchData();
}, []);