import { TEXT_AREA, TEXT_FIELD, NUMERIC_FIELD } from "../../../../../form";

import { textFieldForm } from "./forms";

export const getFormField = (field, i18n) => {
  const type = field.get("type");
  const name = field.get("name");

  switch (type) {
    case TEXT_FIELD:
    case TEXT_AREA:
    case NUMERIC_FIELD:
      return textFieldForm(name, i18n);
    default:
      return textFieldForm(name, i18n);
  }
};

export const toggleHideOnViewPage = (fieldName, fieldData) => ({
  [fieldName]: {
    ...fieldData,
    hide_on_view_page: !fieldData.hide_on_view_page
  }
});
