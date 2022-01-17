import { fromJS } from "immutable";
import { object, string, array } from "yup";

import { FormSectionRecord, FieldRecord, ORDERABLE_OPTIONS_FIELD } from "../../../../../../form";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const tallyFieldForm = ({
  css,
  field,
  formMode,
  i18n,
  isNested,
  lookups,
  onManageTranslations,
  limitedProductionSite,
  parentForm
}) => {
  const fieldName = field.get("name");
  let extraValidations = {};

  extraValidations = {
    selected_value: string().nullable(),
    tally: array().of(
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

  const optionsForm = mode =>
    FormSectionRecord({
      unique_id: "field_form_options",
      name: i18n.t("fields.option_strings_text"),
      fields: [
        FieldRecord({
          display_name: i18n.t("fields.find_lookup"),
          name: `${fieldName}.tally`,
          type: ORDERABLE_OPTIONS_FIELD,
          disabled: mode.get("isEdit"),
          rawOptions: true,
          showDefaultAction: false,
          showDisableOption: false,
          maxOptionsAllowed: 5,
          isTallyField: true
        })
      ]
    });

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, onManageTranslations, limitedProductionSite }),
      optionsForm(formMode),
      visibilityForm({ fieldName, i18n, isNested, limitedProductionSite })
    ]),
    validationSchema: validationSchema({
      fieldName,
      i18n,
      overrides: extraValidations
    })
  };
};
