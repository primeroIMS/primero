import { fromJS } from "immutable";

import { FieldRecord, TEXT_FIELD } from "../../../../../../form";
import { addWithIndex } from "../utils";

import {
  validationSchema,
  generalFields,
  generalForm,
  visibilityForm
} from "./base";

const labelField = (fieldName, i18n) =>
  FieldRecord({
    display_name: i18n.t("fields.tick_box_label"),
    name: `${fieldName}.tick_box_label.en`,
    type: TEXT_FIELD,
    editable: true,
    help_text: i18n.t("fields.must_be_english")
  });

// eslint-disable-next-line import/prefer-default-export
export const tickboxFieldForm = (fieldName, i18n, mode) => {
  const general = Object.values(generalFields(fieldName, i18n, mode));
  const newField = labelField(fieldName, i18n);
  const formFields = addWithIndex(general, 1, newField);

  return {
    forms: fromJS([
      generalForm(fieldName, i18n, mode, formFields),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n)
  };
};
