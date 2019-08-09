export const getFromDate = (state, props, namespace) => {
  return state.getIn(["records", namespace, "filters", props.id, "from"], null);
};
export const getToDate = (state, props, namespace) => {
  return state.getIn(["records", namespace, "filters", props.id, "to"], null);
};
