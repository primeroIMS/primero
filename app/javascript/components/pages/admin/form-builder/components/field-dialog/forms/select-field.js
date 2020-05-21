import { fromJS } from "immutable";
import { object, string, array } from "yup";

import {
  FieldRecord,
  SELECT_FIELD,
  ORDERABLE_OPTIONS_FIELD
} from "../../../../../../form";

import {
  validationSchema,
  generalForm,
  optionsForm,
  visibilityForm
} from "./base";

/* eslint-disable import/prefer-default-export */
export const selectFieldForm = ({ field, i18n, mode }) => {
  const fieldName = field.get("name");
  const options = field.get("option_strings_text", fromJS({}));
  let optionsFormFields = [];
  let extraValidations = {};

  if (options?.size) {
    optionsFormFields = optionsFormFields.concat(
      FieldRecord({
        display_name: i18n.t("fields.find_lookup"),
        name: `${fieldName}.option_strings_text`,
        type: ORDERABLE_OPTIONS_FIELD,
        disabled: mode.get("isEdit"),
        selected_value: field.get("selected_value"),
        option_strings_text: options?.size ? options.toJS() : {}
      })
    );

    extraValidations = {
      selected_value: string(),
      option_strings_text: object().shape({
        en: array().of(
          object().shape({
            display_text: string().required(
              i18n.t("fields.required_field", {
                field: i18n.t("fields.english_text")
              })
            ),
            id: string().required()
          })
        )
      })
    };
  } else if (field.get("option_strings_source")) {
    optionsFormFields = optionsFormFields.concat([
      FieldRecord({
        display_name: i18n.t("fields.find_lookup"),
        name: `${fieldName}.option_strings_source`,
        type: SELECT_FIELD,
        option_strings_source: "Lookups",
        disabled: mode.get("isEdit")
      }),
      FieldRecord({
        display_name: i18n.t("fields.default"),
        name: `${fieldName}.selected_value`,
        type: SELECT_FIELD,
        option_strings_source: field.get("option_strings_source")
      })
    ]);

    extraValidations = {
      option_strings_source: string().required(),
      selected_value: string()
    };
  }

  return {
    forms: fromJS([
      generalForm(fieldName, i18n),
      optionsForm(fieldName, i18n, optionsFormFields),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n, extraValidations)
  };
};
