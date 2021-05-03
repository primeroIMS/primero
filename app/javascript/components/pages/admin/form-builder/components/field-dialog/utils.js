import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";
import mergeWith from "lodash/mergeWith";

import { DATE_FIELD, RADIO_FIELD, SELECT_FIELD, SEPARATOR, SUBFORM_SECTION, TICK_FIELD } from "../../../../../form";
import { NEW_FIELD } from "../../constants";
import { convertToFieldsObject } from "../../utils";
import { toIdentifier } from "../../../../../../libs";

import {
  dateFieldForm,
  textFieldForm,
  tickboxFieldForm,
  selectFieldForm,
  separatorFieldForm,
  subformField
} from "./forms";
import { DATE_FIELD_CUSTOM_VALUES, SUBFORM_TRANSLATABLE_OPTIONS, FIELD_TRANSLATABLE_OPTIONS } from "./constants";

const getDateValidation = (field, isSubmit) => {
  if (!isSubmit) {
    return DATE_FIELD_CUSTOM_VALUES.date_validation[field.date_validation];
  }

  return Object.entries(DATE_FIELD_CUSTOM_VALUES.date_validation).find(
    obj => obj[1] === Boolean(field.date_validation)
  )?.[0];
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

  return Object.entries(field.date_include_time ? selectedValue.withTime : selectedValue.withoutTime).find(
    obj => obj[1] === Boolean(field.selected_value)
  )?.[0];
};

const appendSettingsAttributes = (data, selectedField, newFieldName, lastFieldOrder) => {
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

export const addWithIndex = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

export const transformValues = (field, isSubmit = false) => {
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
      display_name: subform?.name
    };
  }

  return field;
};

export const generateUniqueId = data => {
  return toIdentifier(data);
};

export const buildDataToSave = (selectedField, data, lastFieldOrder, randomSubformId) => {
  const fieldName = selectedField?.get("name");
  const newData = transformValues(
    { ...data, disabled: selectedField?.get("type") === SEPARATOR ? true : data?.disabled },
    true
  );

  if (fieldName !== NEW_FIELD) {
    return { [fieldName]: newData };
  }
  const newFieldName = generateUniqueId(newData.display_name.en);

  const dataToSave = appendSettingsAttributes(newData, selectedField, newFieldName, lastFieldOrder);

  return {
    [newFieldName]:
      isSubformField(selectedField) && fieldName === NEW_FIELD
        ? {
            ...dataToSave,
            subform_section_temp_id: randomSubformId,
            subform_section_unique_id: newFieldName
          }
        : dataToSave
  };
};

export const subformContainsFieldName = (subform, fieldName, selectedSubformField = fromJS({})) => {
  if (selectedSubformField.size > 0) {
    return true;
  }

  if (!subform?.toSeq()?.size) {
    return false;
  }

  return Boolean(
    subform
      ?.get("fields")
      ?.find(field => field.get("name") === fieldName)
      ?.toSeq()?.size
  );
};

export const mergeTranslationKeys = (defaultValues, currValues, isSubform = false) => {
  if (!currValues || isEmpty(currValues)) {
    return defaultValues;
  }

  const mergeWithCondition = (a, b) => (isEmpty(b) ? a : b);
  const translatableOptions = isSubform ? SUBFORM_TRANSLATABLE_OPTIONS : FIELD_TRANSLATABLE_OPTIONS;

  return Object.entries(defaultValues).reduce((acc, curr) => {
    const [key, value] = curr;

    if (translatableOptions.includes(key) && !isEmpty(value)) {
      const mergedValues = mergeWith({}, value, currValues[key], mergeWithCondition);
      const newValue = key === "option_strings_text" ? Object.values(mergedValues) : mergedValues;

      return { ...acc, [key]: newValue };
    }

    return { ...acc, [key]: value };
  }, {});
};
