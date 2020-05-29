import {
  TEXT_AREA,
  TEXT_FIELD,
  NUMERIC_FIELD,
  SUBFORM_SECTION
} from "../../../../../form";

import { textFieldForm, subformField } from "./forms";

/* eslint-disable import/prefer-default-export */
export const getFormField = (field, i18n) => {
  const type = field.get("type");
  const name = field.get("name");

  switch (type) {
    case TEXT_FIELD:
    case TEXT_AREA:
    case NUMERIC_FIELD:
      return textFieldForm(name, i18n);
    case SUBFORM_SECTION:
      return subformField(name, i18n);
    default:
      return textFieldForm(name, i18n);
  }
};
