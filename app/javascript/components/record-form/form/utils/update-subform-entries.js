import omit from "lodash/omit";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

import { compactBlank } from "../../utils";
import { VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS } from "../../../../config";

import buildViolationSubform from "./build-violation-subform";

export default (formik, fieldName, currentIndex, values, isViolation) => {
  if (!isViolation) {
    return formik.setFieldValue(`${fieldName}[${currentIndex}]`, compactBlank(values), false);
  }

  const currentViolationData = omit(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);
  const currentViolationAssociationData = pick(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);

  formik.setFieldValue(`${fieldName}[${currentIndex}]`, compactBlank(currentViolationData), false);

  return Object.entries(currentViolationAssociationData).forEach(entry => {
    const [currentFieldName, currentValues] = entry;

    if (isEmpty(currentValues)) {
      return;
    }

    const newSubformValues = buildViolationSubform(formik.values[currentFieldName], currentValues);

    formik.setFieldValue(currentFieldName, newSubformValues, false);
  });
};
