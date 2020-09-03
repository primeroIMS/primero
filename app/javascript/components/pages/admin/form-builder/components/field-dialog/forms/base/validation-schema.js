import { boolean, object, string } from "yup";

import { validateEnglishName } from "../../../../utils";

/* eslint-disable import/prefer-default-export */
export const validationSchema = ({ fieldName, i18n, overrides = {} }) =>
  object().shape({
    [fieldName]: object().shape({
      display_name: object().shape({
        en: string()
          .test(
            `${fieldName}.display_name.en`,
            i18n.t("forms.invalid_characters_field", { field: i18n.t("fields.name") }),
            validateEnglishName
          )
          .required(i18n.t("forms.required_field", { field: i18n.t("fields.name") }))
      }),
      help_text: object().shape({
        en: string()
      }),
      required: boolean(),
      ...overrides
    })
  });
