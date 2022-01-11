import { fromJS } from "immutable";
import { array, object, string } from "yup";

import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_FIELD, TICK_FIELD } from "../../../form";

export const validations = () =>
  object().shape({
    agency_unique_ids: array().of(string()).nullable(),
    description: string().nullable(),
    name: string().required()
  });

export const form = (i18n, userGroupPermission) => {
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
          display_name: i18n.t("user_group.disabled.label"),
          name: "disabled",
          type: TICK_FIELD,
          tooltip: i18n.t("user_group.disabled.explanation")
        }),
        FieldRecord({
          display_name: i18n.t("user_group.description"),
          name: "description",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user_group.associated_agencies"),
          name: "agency_unique_ids",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_source: userGroupPermission === "all" ? OPTION_TYPES.AGENCY : OPTION_TYPES.AGENCY_CURRENT_USER,
          option_strings_source_id_key: "unique_id"
        })
      ]
    })
  ]);
};
