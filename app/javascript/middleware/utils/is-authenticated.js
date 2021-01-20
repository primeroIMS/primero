export default store => {
  return store.getState().getIn(["user", "isAuthenticated"], false);
};
