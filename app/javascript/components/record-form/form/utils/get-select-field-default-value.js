import isNil from "lodash/isNil";

export default (field, selectedDefaultValue) => {
  if (field.multi_select && !Array.isArray(selectedDefaultValue)) {
    return isNil(selectedDefaultValue) ? [] : [selectedDefaultValue];
  }

  return selectedDefaultValue;
};
