const fetchData = async () => {
  setLoading(true);

  valpreAPIGet(`${baseurl}/refData?flowId=PBIDV`)
    .then(response => {
      const processedRefData = processRefData(response);
      setData(processedRefData);
    })
    .catch(err => {
      setContextError((err as Error).message);
    })
    .finally(() => {
      setLoading(false);
    });
};

fetchData();