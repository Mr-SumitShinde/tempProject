useEffect(() => {
  let arrStatusList = context?.data?.['CSTATUS'] ? [...context.data['CSTATUS']] : [];
  arrStatusList = [{ key: "", text: "" }, ...arrStatusList.filter(item => item.key || item.text)];
  setStatusList(arrStatusList);
}, []);