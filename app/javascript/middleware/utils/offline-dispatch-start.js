export default (store, action) => {
  const { type } = action;

  store.dispatch({
    type: `${type}_STARTED`,
    payload: true
  });
};
