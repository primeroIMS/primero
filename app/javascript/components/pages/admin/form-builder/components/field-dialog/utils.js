import { SELECT_FIELD } from "../../../../../form";

import { textFieldForm, selectFieldForm } from "./forms";

export const getFormField = ({ field, i18n, mode }) => {
  const type = field.get("type");

  switch (type) {
    case SELECT_FIELD:
      return selectFieldForm({ field, i18n, mode });
    default:
      return textFieldForm({ field, i18n });
  }
};

export const toggleHideOnViewPage = (fieldName, fieldData) => ({
  [fieldName]: {
    ...fieldData,
    hide_on_view_page: !fieldData.hide_on_view_page
  }
});
