import { fromJS } from "immutable";
import { object, string, array } from "yup";

import {
  validationSchema,
  generalForm,
  optionsForm,
  visibilityForm
} from "./base";

/* eslint-disable import/prefer-default-export */
export const selectFieldForm = ({ field, i18n, mode, lookups, css }) => {
  const fieldName = field.get("name");
  const options = field.get("option_strings_text", fromJS({}));
  let extraValidations = {};

  if (options?.size) {
    extraValidations = {
      selected_value: string().nullable(),
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
    extraValidations = {
      option_strings_source: string().required(),
      selected_value: string().nullable()
    };
  }

  return {
    forms: fromJS([
      generalForm(fieldName, i18n, mode),
      optionsForm(fieldName, i18n, mode, field, lookups, css),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n, extraValidations)
  };
};
