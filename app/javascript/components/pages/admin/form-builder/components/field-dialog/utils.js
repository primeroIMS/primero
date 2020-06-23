import {
  DATE_FIELD,
  RADIO_FIELD,
  SELECT_FIELD,
  SEPARATOR,
  SUBFORM_SECTION,
  TICK_FIELD
} from "../../../../../form";
import { NEW_FIELD } from "../../constants";
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

const appendSettingsAttributes = (
  data,
  selectedField,
  newFieldName,
  lastFieldOrder
) => {
  const type = selectedField.get("type");
  const order = lastFieldOrder ? lastFieldOrder + 1 : 0;
  const multiSelect = {
    multi_select: Boolean(selectedField.get("multi_select"))
  };
  const dateIncludeTime = {
    date_include_time: Boolean(selectedField.get("date_include_time"))
  };

  return {
    ...data,
    type,
    name: newFieldName,
    order,
    ...multiSelect,
    ...dateIncludeTime
  };
};

export const getFormField = fieldOptions => {
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
    default:
      return textFieldForm(fieldOptions);
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
    };
  }

  return fieldData;
};

export const isSubformField = field => field?.get("type") === SUBFORM_SECTION;

export const setInitialForms = subform => {
  if (subform) {
    return {
      ...subform,
      initial_subforms: subform.starts_with_one_entry ? 1 : 0
    };
  }

  return subform;
};

export const getSubformValues = subform => {
  const subformData = subform.toJS();

  return {
    subform_section: {
      ...subformData,
      starts_with_one_entry: Boolean(subform.initial_subforms),
      fields: convertToFieldsObject(subformData.fields)
    }
  };
};

export const setSubformData = (field, subform) => {
  if (subform) {
    return {
      ...field,
      display_name: { en: subform?.name?.en || "" }
    };
  }

  return field;
};

export const buildDataToSave = (
  selectedField,
  data,
  locale,
  lastFieldOrder
) => {
  const fieldName = selectedField?.get("name");

  if (fieldName !== NEW_FIELD) {
    return { [fieldName]: data };
  }
  const newFieldName = data.display_name[locale]
    .split(" ")
    .join("_")
    .toLowerCase();

  const dataToSave = appendSettingsAttributes(
    data,
    selectedField,
    newFieldName,
    lastFieldOrder
  );

  return {
    [newFieldName]: dataToSave
  };
};

export const subformContainsFieldName = (subform, fieldName) => {
  if (!subform?.toSeq()?.size) {
    return false;
  }

  return Boolean(
    subform
      ?.get("fields")
      .find(field => field.get("name") === fieldName)
      ?.toSeq()?.size
  );
};
