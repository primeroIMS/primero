/* eslint-disable import/prefer-default-export */
import {
  DATE_FIELD,
  TEXT_AREA,
  TEXT_FIELD,
  NUMERIC_FIELD
} from "../../../../../form";

import { dateFieldForm, textFieldForm } from "./forms";
import { DATE_FIELD_CUSTOM_VALUES } from "./constants";

const getDateValidation = (field, isSubmit) => {
  if (!isSubmit) {
    return DATE_FIELD_CUSTOM_VALUES.date_validation[field.date_validation];
  }

  return Object.entries(DATE_FIELD_CUSTOM_VALUES.date_validation).find(
    obj => obj[1] === field.date_validation
  )[0];
};

const getSelectedDateValue = (field, isSubmit) => {
  if (!field.selected_value) {
    return false;
  }

  const selectedValue = DATE_FIELD_CUSTOM_VALUES.selected_value;

  if (!isSubmit) {
    return field.date_include_time
      ? selectedValue.withTime[field.selected_value]
      : selectedValue.withoutTime[field.selected_value];
  }

  return field.date_include_time
    ? Object.entries(selectedValue.withTime).find(
        obj => obj[1] === field.selected_value
      )[0]
    : Object.entries(selectedValue.withoutTime).find(
        obj => obj[1] === field.selected_value
      )[0];
};

export const getFormField = (field, i18n, css) => {
  const type = field.get("type");
  const name = field.get("name");

  switch (type) {
    case TEXT_FIELD:
    case TEXT_AREA:
    case NUMERIC_FIELD:
      return textFieldForm(name, i18n);
    case DATE_FIELD:
      return dateFieldForm(field, i18n, css);
    default:
      return textFieldForm(name, i18n);
  }
};

export const addWithIndex = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
];

export const transformValues = (field, isSubmit = false) => {
  switch (field.type) {
    case DATE_FIELD:
      return {
        ...field,
        date_validation: getDateValidation(field, isSubmit),
        selected_value: getSelectedDateValue(field, isSubmit)
      };
    default:
      return { ...field };
  }
};
