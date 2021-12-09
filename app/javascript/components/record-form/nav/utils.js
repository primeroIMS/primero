import { OrderedMap } from "immutable";

import { NavRecord } from "../records";
import { VIOLATION_GROUP, VIOLATIONS_FORM } from "../../../config";

export default formGroupOrdered => {
  if (formGroupOrdered.valueSeq().first().group !== VIOLATION_GROUP) {
    return formGroupOrdered;
  }

  return OrderedMap(
    VIOLATIONS_FORM.reduce((acc, current, index) => {
      const currentForm = formGroupOrdered.valueSeq().find(form => form.formId === current) || NavRecord({});

      return { ...acc, [index]: currentForm };
    }, {})
  );
};
