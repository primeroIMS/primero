import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../../../../form";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const signatureFieldForm = ({
  field,
  i18n,
  formMode,
  isNested,
  onManageTranslations,
  limitedProductionSite,
  canManage
}) => {
  const fieldName = field.get("name");
  const fieldType = field.get("type");

  const metaForm = () =>
    FormSectionRecord({
      unique_id: "field_form_meta",
      name: i18n.t("fields.additional_settings"),
      fields: [
        FieldRecord({
          display_name: i18n.t("fields.signature_provided_by_label"),
          name: `${fieldName}.signature_provided_by_label.en`,
          type: TEXT_FIELD,
          required: false,
          help_text: i18n.t("fields.must_be_english"),
          hint: formMode.get("isNew") ? "" : `${i18n.t("fields.db_name")}: ${fieldName}`,
          disabled: limitedProductionSite
        })
      ]
    });

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, onManageTranslations, limitedProductionSite, canManage }),
      metaForm(formMode),
      visibilityForm({ fieldName, fieldType, i18n, isNested, limitedProductionSite, canManage })
    ]),
    validationSchema: validationSchema({ fieldName, i18n })
  };
};
