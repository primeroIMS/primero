export const getFromDate = (state, props, namespace) => {
  return state.getIn(
    ["records", namespace, "filters", props.field_name, "from"],
    null
  );
};
export const getToDate = (state, props, namespace) => {
  return state.getIn(
    ["records", namespace, "filters", props.field_name, "to"],
    null
  );
};
