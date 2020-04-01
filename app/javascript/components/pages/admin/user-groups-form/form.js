import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

export const validations = () =>
  object().shape({
    description: string(),
    name: string().required()
  });

export const form = i18n => {
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
