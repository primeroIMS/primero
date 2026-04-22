import isEmpty from "lodash/isEmpty";

export default (field, selectedDefaultValue) => {
  if (field.multi_select && !Array.isArray(selectedDefaultValue)) {
    return isEmpty(selectedDefaultValue) ? [] : [selectedDefaultValue];
  }

  return selectedDefaultValue;
};
