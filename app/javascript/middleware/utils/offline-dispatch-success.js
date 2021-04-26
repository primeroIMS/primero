import handleRestCallback from "./handle-rest-callback";

export default (store, action, payload) => {
  const { type, api, fromQueue } = action;

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload
  });

  handleRestCallback(store, api?.successCallback, null, payload, fromQueue);

  store.dispatch({
    type: `${type}_FINISHED`,
    payload: true
  });
};
