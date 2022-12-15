export default (store, action) => {
  store.dispatch({
    type: `${action.type}_STARTED`,
    payload: true
  });
};
