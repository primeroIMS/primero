export const getSelect = (state, props, namespace) => {
  if (props.options.defaultValue) {
    return state.getIn(
      ["records", namespace, "filters", props.id, "value"],
      ""
    );
  }
  return state.getIn(["records", namespace, "filters", props.id], "");
};
