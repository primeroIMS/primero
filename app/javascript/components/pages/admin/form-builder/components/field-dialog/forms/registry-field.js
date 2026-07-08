import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../../form";
import { LOOKUPS } from "../../../../../../../config";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const registryFieldForm = ({
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
          display_name: i18n.t("fields.registry_type"),
          name: `${fieldName}.option_strings_source`,
          type: SELECT_FIELD,
          option_strings_source: LOOKUPS.registry_type,
          required: true
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
