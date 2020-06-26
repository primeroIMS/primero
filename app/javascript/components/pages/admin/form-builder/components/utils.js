import {
  MULTI_SELECT_FIELD,
  DATE_TIME_FIELD
} from "./custom-field-selector-dialog/constants";

export const getFieldsAttribute = isNested =>
  isNested ? "subform_section.fields" : "fields";

export const getFiedListItemTheme = currentTheme => ({
  ...currentTheme,
  overrides: {
    ...currentTheme.overrides,
    MuiFormControl: {
      ...currentTheme.overrides.MuiFormControl,
      root: {
        ...currentTheme.overrides.MuiFormControl.root,
        marginBottom: 0
      }
    },
    MuiCheckbox: {
      ...currentTheme.overrides.MuiCheckbox,
      root: {
        ...currentTheme.overrides.MuiCheckbox.root,
        padding: "0 0.2em",
        margin: "0 0.4em"
      }
    },
    MuiFormControlLabel: {
      root: {
        ...currentTheme.overrides.MuiFormControlLabel.root,
        marginLeft: 0,
        marginRight: 0
      }
    }
  }
});

export const getLabelTypeField = field => {
  const isMultiSelect = field.get("multi_select");
  const isDateTime = field.get("date_include_time");

  if (isMultiSelect) {
    return MULTI_SELECT_FIELD;
  }
  if (isDateTime) {
    return DATE_TIME_FIELD;
  }

  return field.get("type");
};
