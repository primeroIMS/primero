import { fromJS } from "immutable";

import { FieldRecord, TEXT_FIELD } from "../../../../../../form";
import { addWithIndex } from "../utils";

import {
  validationSchema,
  generalFields,
  generalForm,
  visibilityForm
} from "./base";

const labelField = ({ fieldName, i18n }) =>
  FieldRecord({
    display_name: i18n.t("fields.tick_box_label"),
    name: `${fieldName}.tick_box_label.en`,
    type: TEXT_FIELD,
    editable: true,
    help_text: i18n.t("fields.must_be_english")
  });

// eslint-disable-next-line import/prefer-default-export
export const tickboxFieldForm = ({ field, i18n, formMode, isNested }) => {
  const fieldName = field.get("name");
  const general = Object.values(generalFields({ fieldName, i18n, formMode }));
  const newField = labelField({ fieldName, i18n });
  const fields = addWithIndex(general, 1, newField);

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, fields }),
      visibilityForm({ fieldName, i18n, isNested })
    ]),
    validationSchema: validationSchema({ fieldName, i18n, isNested })
  };
};
