import handleRestCallback from "./handle-rest-callback";

export default (store, action, payload) => {
  const { type, api, fromQueue } = action;
  const data = {
    ...payload?.data,
    ...(api?.responseExtraParams && { ...api?.responseExtraParams })
  };

  const responseRecordData = { [api?.responseRecordKey]: api?.responseRecordArray ? [data] : data };

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload:
      api?.responseRecordKey || api?.responseRecordParams
        ? {
            data: {
              record: {
                id: api?.responseRecordID,
                ...(api?.responseRecordParams || {}),
                ...(api?.responseRecordKey ? responseRecordData : {})
              }
            }
          }
        : payload
  });

  handleRestCallback(store, api?.successCallback, null, payload, fromQueue);

  store.dispatch({
    type: `${type}_FINISHED`,
    payload: true
  });
};
