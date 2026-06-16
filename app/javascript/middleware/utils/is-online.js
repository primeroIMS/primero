export default store => {
  return store.getState().getIn(["connectivity", "online"], false);
};
