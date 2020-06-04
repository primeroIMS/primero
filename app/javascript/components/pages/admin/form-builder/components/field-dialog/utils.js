import {
  DATE_FIELD,
  RADIO_FIELD,
  SELECT_FIELD,
  SEPARATOR,
  SUBFORM_SECTION,
  TICK_FIELD
} from "../../../../../form";
import { convertToFieldsObject } from "../../utils";

import {
  dateFieldForm,
  textFieldForm,
  tickboxFieldForm,
  selectFieldForm,
  separatorFieldForm,
  subformField
} from "./forms";
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

  return Object.entries(
    field.date_include_time ? selectedValue.withTime : selectedValue.withoutTime
  ).find(obj => obj[1] === field.selected_value)[0];
};

export const getFormField = ({ field, i18n, mode, css }) => {
  const type = field.get("type");
  const name = field.get("name");

  switch (type) {
    case DATE_FIELD:
      return dateFieldForm(field, i18n, css);
    case RADIO_FIELD:
    case SELECT_FIELD:
      return selectFieldForm({ field, i18n, mode });
    case SEPARATOR:
      return separatorFieldForm(name, i18n);
    case SUBFORM_SECTION:
      return subformField(name, i18n);
    case TICK_FIELD:
      return tickboxFieldForm(name, i18n);
    default:
      return textFieldForm({ field, i18n });
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

export const toggleHideOnViewPage = fieldData => {
  // eslint-disable-next-line camelcase
  if (fieldData?.hide_on_view_page !== undefined) {
    return {
      ...fieldData,
      hide_on_view_page: !fieldData.hide_on_view_page
    }
  }

  return fieldData;
};

export const isSubformField = field => field.get("type") === SUBFORM_SECTION;

export const setInitialForms = subform => ({
  ...subform,
  initial_subforms: subform.starts_with_one_entry ? 1 : 0
});

export const setStartsWithOneEntry = subform => ({
  ...subform,
  starts_with_one_entry: Boolean(subform.initial_subforms)
});

export const getSubformValues = subform => {
  const subformData = subform.toJS();

  return {
    subform_section: {
      ...subformData,
      fields: convertToFieldsObject(subformData.fields)
    }
  };
};

export const setSubformName = (field, subform) => {
  if (subform) {
    return {
      ...field,
      display_name: { en: subform?.name?.en || "" }
    }
  }

  return field;
}
