import isEmpty from "lodash/isEmpty";

import { VIOLATIONS_ASSOCIATIONS_RESPONSES } from "../../../../config";

export default (fieldName, violationID, parentUniqueId) => {
  if (!isEmpty(violationID)) {
    return violationID;
  }

  return fieldName === VIOLATIONS_ASSOCIATIONS_RESPONSES ? parentUniqueId : [parentUniqueId];
};
