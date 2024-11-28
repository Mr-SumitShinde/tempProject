const postCaseDetails = async (requestOptions: any) => {
  valpreAPIPost('/pbwm/apis/identityVerification/idv', requestOptions)
    .then(response => {
      const caseId = response?.data?.attributes?.caseId;
      setCaseId(caseId);
      navigate(routes?.createDetails, {
        caseRef: caseId,
        newCase: true,
        state: {
          status: 'CASE CREATED',
          caseInfo: {},
        },
      });
    })
    .catch(error => {
      window.scrollTo(0, 0);
      setErrorFlag(true);
      console.error('Error posting data', error);
    });
};