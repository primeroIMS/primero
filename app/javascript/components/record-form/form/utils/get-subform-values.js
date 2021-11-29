import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import { valuesWithDisplayConditions } from "../subforms/subform-field-array/utils";

import getViolationAssociationsValues from "./get-violation-associations-values";

export default (field, index, values, orderedValues = [], isViolation = false) => {
  const { subform_section_configuration: subformSectionConfiguration } = field;

  const { display_conditions: displayConditions } = subformSectionConfiguration || {};

  if (index === 0 || index > 0) {
    const associatedValues = isViolation ? getViolationAssociationsValues(values) : {};

    if (displayConditions) {
      return valuesWithDisplayConditions(getIn(values, field.name), displayConditions)[index];
    }

    const subforData = isEmpty(orderedValues) ? getIn(values, `${field.name}[${index}]`) : orderedValues[index];

    return { ...subforData, ...associatedValues };
  }

  return {};
};
