export const getCheckBoxes = (state, props, namespace) => {
  return state.getIn(["records", namespace, "filters", props.id], []);
};
