const handleGenLink = async () => {
  if (casestatus === 'REVIEW' || casestatus === 'APPROVED') {
    const url = `${baseurl}/${caseDetailsData?.data?.attributes?.caseDetails?.caseId}/documents`;

    valpreAPIGet(url, requestOptions)
      .then(async (response) => {
        await setReportData(response);
        await pdfGenerator(
          response?.data?.attributes?.file,
          caseDetailsData?.data?.attributes?.caseDetails?.caseId
        );
      })
      .catch((error) => {
        window.scrollTo(0, 0);
        setErrorFlag(true);
        console.error('Error downloading PDF file', error);
        throw error;
      });
  } else {
    const queryParams = { refreshStatus: 'Y', generateLink: 'Y' };
    const url = urlGen(queryParams);

    valpreAPIGet(url, requestOptions)
      .then(async (response) => {
        await setCaseDetailsData(response);
        setGenlinkFlag(true);
        window.scrollTo(0, document.body.scrollHeight);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
        setErrorFlag(true);
      });
  }
};