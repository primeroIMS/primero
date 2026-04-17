import isEmpty from "lodash/isEmpty";

// eslint-disable-next-line import/prefer-default-export
export const getFormGroupName = (formGroupLookup, formGroupID) => {
  if (isEmpty(formGroupLookup) || isEmpty(formGroupID)) {
    return "";
  }

  // eslint-disable-next-line camelcase
  return formGroupLookup?.find(fromGroupLookup => fromGroupLookup.id === formGroupID)?.display_text;
};
