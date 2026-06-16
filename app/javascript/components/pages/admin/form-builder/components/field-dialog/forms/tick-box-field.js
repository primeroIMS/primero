import { fromJS } from "immutable";

import { FieldRecord, TEXT_FIELD } from "../../../../../../form";
import addWithIndex from "../utils/add-with-index";

import { validationSchema, generalFields, generalForm, visibilityForm } from "./base";

const labelField = ({ fieldName, i18n }) =>
  FieldRecord({
    display_name: i18n.t("fields.tick_box_label"),
    name: `${fieldName}.tick_box_label.en`,
    type: TEXT_FIELD,
    editable: true,
    help_text: i18n.t("fields.must_be_english")
  });

// eslint-disable-next-line import/prefer-default-export
export const tickboxFieldForm = ({
  field,
  i18n,
  formMode,
  isNested,
  onManageTranslations,
  limitedProductionSite,
  canManage
}) => {
  const fieldName = field.get("name");
  const general = Object.values(generalFields({ fieldName, i18n, formMode, canManage }));
  const newField = labelField({ fieldName, i18n });
  const fields = addWithIndex(general, 1, newField);

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, fields, onManageTranslations, limitedProductionSite, canManage }),
      visibilityForm({ fieldName, i18n, isNested, limitedProductionSite, canManage })
    ]),
    validationSchema: validationSchema({ fieldName, i18n, isNested })
  };
};
