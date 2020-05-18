import { boolean, object, string } from "yup";

/* eslint-disable import/prefer-default-export */
export const validationSchema = (fieldName, i18n, overrides = {}) =>
  object().shape({
    [fieldName]: object().shape({
      display_name: object().shape({
        en: string().required(
          i18n.t("forms.required_field", { field: i18n.t("fields.name") })
        )
      }),
      help_text: object().shape({
        en: string()
      }),
      required: boolean(),
      ...overrides
    })
  });
