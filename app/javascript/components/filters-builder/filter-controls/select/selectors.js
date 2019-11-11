export const getSelect = (state, obj) => {
  const { recordType, isDate, props } = obj;

  if (isDate) {
    return state.getIn(
      ["records", recordType, "filters", props.field_name, "value"],
      ""
    );
  }

  return state.getIn(["records", recordType, "filters", props.field_name], "");
};
