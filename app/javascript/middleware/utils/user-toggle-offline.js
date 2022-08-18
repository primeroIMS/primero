export default store => {
  return store.getState().getIn(["connectivity", "fieldMode"], false);
};
