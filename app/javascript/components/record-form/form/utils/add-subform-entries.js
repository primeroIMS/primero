import omit from "lodash/omit";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

import { compactBlank } from "../../utils";
import { VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS } from "../../../../config";

import buildViolationSubform from "./build-violation-subform";

export default (formik, arrayHelpers, values, isViolation) => {
  if (!isViolation) {
    return arrayHelpers.push(values);
  }

  const currentViolationData = omit(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);
  const currentViolationAssociationData = pick(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);

  arrayHelpers.push(compactBlank(currentViolationData));

  return Object.entries(currentViolationAssociationData).forEach(entry => {
    const [currentFieldName, currentValues] = entry;

    if (isEmpty(currentValues)) {
      return;
    }

    const newSubformValues = buildViolationSubform(formik.values[currentFieldName], currentValues);

    formik.setFieldValue(currentFieldName, newSubformValues, false);
  });
};
