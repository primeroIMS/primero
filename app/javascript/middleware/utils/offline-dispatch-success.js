import handleRestCallback from "./handle-rest-callback";

export default (store, action, payload) => {
  const { type, api, fromQueue } = action;
  const data = {
    ...payload?.data,
    ...(api?.responseExtraParams && { ...api?.responseExtraParams })
  };

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: api?.responseRecordKey
      ? {
          data: {
            record: {
              id: api?.responseRecordID,
              [api?.responseRecordKey]: api?.responseRecordArray ? [data] : data
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
