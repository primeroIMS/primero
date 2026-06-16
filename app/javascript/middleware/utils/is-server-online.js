export default store => {
  return store.getState().getIn(["connectivity", "serverOnline"], false);
};
