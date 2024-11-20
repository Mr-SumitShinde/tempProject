useEffect(() => {
  let arrCty = context?.data?.['CTY'] ? [{ key: "", text: "" }, ...context.data['CTY'].filter(item => item.key || item.text)] : [{ key: "", text: "" }];
  setCountryResidenceData(arrCty);

  let arrSS = context?.data?.['PBIDVSS'] ? [{ key: "", text: "" }, ...context.data['PBIDVSS'].filter(item => item.key || item.text)] : [{ key: "", text: "" }];
  setSourceSystemData(arrSS);
}, []);