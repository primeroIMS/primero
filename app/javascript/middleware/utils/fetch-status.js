export default ({ store, type }, action, loading) => {
  store.dispatch({
    type: `${type}_${action}`,
    payload: loading
  });
};
