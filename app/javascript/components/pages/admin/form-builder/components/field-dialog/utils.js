import {
  TEXT_AREA,
  TEXT_FIELD,
  NUMERIC_FIELD,
  SELECT_FIELD
} from "../../../../../form";

import { textFieldForm, selectFieldForm } from "./forms";

/* eslint-disable import/prefer-default-export */
export const getFormField = ({ field, i18n, mode }) => {
  const type = field.get("type");

  switch (type) {
    case TEXT_FIELD:
    case TEXT_AREA:
    case NUMERIC_FIELD:
      return textFieldForm({ field, i18n });
    case SELECT_FIELD:
      return selectFieldForm({ field, i18n, mode });
    default:
      return textFieldForm({ field, i18n });
  }
};
