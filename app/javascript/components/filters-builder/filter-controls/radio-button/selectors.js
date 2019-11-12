export const getRadioButtons = (state, obj) => {
  const { recordType, props } = obj;

  return state.getIn(["records", recordType, "filters", props.field_name], "");
};
