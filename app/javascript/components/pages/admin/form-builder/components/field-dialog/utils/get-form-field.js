// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  DATE_FIELD,
  RADIO_FIELD,
  SELECT_FIELD,
  SEPARATOR,
  SUBFORM_SECTION,
  TALLY_FIELD,
  TICK_FIELD
} from "../../../../../../form";
import {
  dateFieldForm,
  tallyFieldForm,
  textFieldForm,
  tickboxFieldForm,
  selectFieldForm,
  separatorFieldForm,
  subformField
} from "../forms";

export default fieldOptions => {
  const { field } = fieldOptions;

  if (!field?.toSeq()?.size) {
    return { forms: [], validationSchema: {} };
  }

  switch (field?.get("type")) {
    case DATE_FIELD:
      return dateFieldForm(fieldOptions);
    case RADIO_FIELD:
    case SELECT_FIELD:
      return selectFieldForm(fieldOptions);
    case SEPARATOR:
      return separatorFieldForm(fieldOptions);
    case SUBFORM_SECTION:
      return subformField(fieldOptions);
    case TICK_FIELD:
      return tickboxFieldForm(fieldOptions);
    case TALLY_FIELD:
      return tallyFieldForm(fieldOptions);
    default:
      return textFieldForm(fieldOptions);
  }
};
