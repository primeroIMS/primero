import { fromJS } from "immutable";
import { object, string, array } from "yup";

import { validationSchema, generalForm, optionsForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const selectFieldForm = ({
  css,
  field,
  formMode,
  i18n,
  isNested,
  lookups,
  onManageTranslations,
  limitedProductionSite
}) => {
  const fieldName = field.get("name");
  let extraValidations = {};

  extraValidations = {
    selected_value: string().nullable(),
    option_strings_source: string()
      .nullable()
      .when("option_strings_text", {
        is: value => !value?.length,
        then: string().nullable().required(),
        otherwise: string().nullable().notRequired()
      }),
    option_strings_text: array().of(
      object().shape({
        display_text: object().shape({
          en: string().required(
            i18n.t("fields.required_field", {
              field: i18n.t("fields.english_text")
            })
          )
        }),
        id: string().required()
      })
    )
  };

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, onManageTranslations, limitedProductionSite }),
      optionsForm({ fieldName, i18n, formMode, field, lookups, css, limitedProductionSite }),
      visibilityForm({ fieldName, i18n, isNested, limitedProductionSite })
    ]),
    validationSchema: validationSchema({
      fieldName,
      i18n,
      overrides: extraValidations
    })
  };
};
