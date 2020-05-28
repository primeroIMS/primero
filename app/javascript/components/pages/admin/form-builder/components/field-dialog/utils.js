import { SELECT_FIELD, TICK_FIELD } from "../../../../../form";

import { textFieldForm, tickboxFieldForm, selectFieldForm } from "./forms";

export const getFormField = ({ field, i18n, mode }) => {
  const type = field.get("type");

  switch (type) {
    case SELECT_FIELD:
      return selectFieldForm({ field, i18n, mode });
    case TICK_FIELD:
      return tickboxFieldForm(field.get("name"), i18n);
    default:
      return textFieldForm({ field, i18n });
  }
};

export const addWithIndex = (arr, index, newItem) => [
  ...arr.slice(0, index),

  newItem,

  ...arr.slice(index)
];

export const toggleHideOnViewPage = (fieldName, fieldData) => ({
  [fieldName]: {
    ...fieldData,
    hide_on_view_page: !fieldData.hide_on_view_page
  }
});
