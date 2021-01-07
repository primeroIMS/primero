export default action => {
  const { api } = action;

  const responseRecordData = {
    [api?.responseRecordKey]: api?.responseRecordArray
      ? [{ ...api?.responseRecordValues }]
      : { ...api?.responseRecordValues }
  };

  return api?.responseRecordKey || api?.responseRecordParams
    ? {
        ...action,
        api: {
          ...action.api,
          body: {
            ...api?.body,
            data: {
              ...api?.body?.data,
              id: api?.responseRecordID,
              ...(api?.responseRecordParams || {}),
              ...(api?.responseRecordKey ? responseRecordData : {})
            }
          }
        }
      }
    : action;
};
