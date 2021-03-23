/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, DATE_FIELD, TEXT_FIELD, TEXT_AREA } from "../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "code_of_conduct",
      fields: [
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.title"),
          name: "title",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.content"),
          name: "content",
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.created_by"),
          name: "created_by",
          type: TEXT_FIELD,
          disabled: true
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.created_on"),
          name: "created_on",
          date_include_time: true,
          type: DATE_FIELD,
          disabled: true
        })
      ]
    })
  ]);
};
