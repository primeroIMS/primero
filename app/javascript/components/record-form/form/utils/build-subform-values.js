import omit from "lodash/omit";

import { VIOLATIONS_SUBFORM_UNIQUE_IDS, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS } from "../../../../config";

export default (fieldName, values) => {
  if (VIOLATIONS_SUBFORM_UNIQUE_IDS.includes(fieldName)) {
    return omit(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);
  }

  return values;
};
