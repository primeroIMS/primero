import isEmpty from "lodash/isEmpty";

// eslint-disable-next-line import/prefer-default-export
export const getFormGroupName = (formGroupLookup, formGroupID) => {
  if (isEmpty(formGroupLookup) || isEmpty(formGroupID)) {
    return "";
  }

  return formGroupLookup?.find(fromGroupLookup => fromGroupLookup.get("id") === formGroupID)?.get("display_text");
};
