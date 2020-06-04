export default store => {
  return store.getState().getIn(["application", "online"], false);
};
