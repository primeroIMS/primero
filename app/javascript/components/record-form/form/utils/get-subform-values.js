import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import { valuesWithDisplayConditions } from "../subforms/subform-field-array/utils";

export default (field, index, values, orderedValues = []) => {
  const { subform_section_configuration: subformSectionConfiguration } = field;

  const { display_conditions: displayConditions } = subformSectionConfiguration || {};

  if (index === 0 || index > 0) {
    if (displayConditions) {
      return valuesWithDisplayConditions(getIn(values, field.name), displayConditions)[index];
    }

    return isEmpty(orderedValues) ? getIn(values, `${field.name}[${index}]`) : orderedValues[index];
  }

  return {};
};
