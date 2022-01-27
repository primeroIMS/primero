import { DATE_FIELD } from "../../../../../../form";

import getDateValidation from "./get-date-validation";
import getSelectedDateValue from "./get-selected-date-value";

export default (field, isSubmit = false) => {
  switch (field.type) {
    case DATE_FIELD:
      return {
        ...field,
        date_validation: getDateValidation(field, isSubmit),
        selected_value: getSelectedDateValue(field, isSubmit)
      };
    default:
      return {
        ...field
      };
  }
};
