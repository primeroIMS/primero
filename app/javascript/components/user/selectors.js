export const selectPrimeroModule = state => {
  return state.getIn(["user", "primeroModule"], null);
};
