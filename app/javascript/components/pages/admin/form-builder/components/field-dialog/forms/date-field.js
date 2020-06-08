import { fromJS } from "immutable";

import {
  TEXT_FIELD,
  TOGGLE_FIELD,
  FieldRecord,
  TICK_FIELD
} from "../../../../../../form";

import {
  validationSchema,
  generalFields,
  generalForm,
  visibilityForm
} from "./base";

const customFields = (field, i18n, css) => {
  const fieldName = field.get("name");
  const includeTime = field.get("date_include_time");

  return [
    FieldRecord({
      display_name: i18n.t("fields.future_date_not_valid"),
      name: `${fieldName}.date_validation`,
      type: TOGGLE_FIELD
    }),
    FieldRecord({
      display_name: i18n.t(
        `fields.default_to_current_date${includeTime ? "time" : ""}`
      ),
      name: `${fieldName}.selected_value`,
      type: TOGGLE_FIELD
    }),
    FieldRecord({
      name: `${fieldName}.type`,
      type: TEXT_FIELD,
      inputClassname: css.hiddenField
    }),
    FieldRecord({
      name: `${fieldName}.date_include_time`,
      type: TICK_FIELD,
      inputClassname: css.hiddenField
    })
  ];
};

// eslint-disable-next-line import/prefer-default-export
export const dateFieldForm = (field, i18n, css) => {
  const fieldName = field.get("name");
  const custom = customFields(field, i18n, css);
  const formFields = [
    ...Object.values(generalFields(fieldName, i18n)),
    ...custom
  ];

  return {
    forms: fromJS([
      generalForm(fieldName, i18n, formFields),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n)
  };
};
