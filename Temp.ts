useEffect(() => {
  setStatusList([]);

  let arrStatusList = context?.data?.['CSTATUS'] ? [...context.data['CSTATUS']] : [];

  if (!arrStatusList.find(item => item.key === "" && item.text === "")) {
    arrStatusList.unshift({ key: "", text: "" });
  }

  setStatusList(arrStatusList);
}, [context?.data]); // Now the effect runs whenever `context?.data` changes.