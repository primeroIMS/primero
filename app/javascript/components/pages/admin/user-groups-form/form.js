import { fromJS } from "immutable";
import * as yup from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

export const validations = (formMode, i18n) =>
  yup.object().shape({
    description: yup.string().nullable(),
    name: yup.string().required()
  });

export const form = (i18n, formMode) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "user_groups",
      fields: [
        FieldRecord({
          display_name: i18n.t("user_group.name"),
          name: "name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("user_group.description"),
          name: "description",
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
