export default store => {
  return store.getState().getIn(["application", "demo"], false);
};
