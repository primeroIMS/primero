/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, DATE_FIELD, TEXT_FIELD, TEXT_AREA } from "../../../form";

import { TITLE_FIELD, CONTENT_FIELD, CREATED_ON_FIELD, CREATED_BY_FIELD } from "./constants";

export const validations = i18n =>
  object().shape({
    [CONTENT_FIELD]: string().required(
      i18n.t("forms.required_field", { field: i18n.t("code_of_conduct.field.content") })
    ),
    [TITLE_FIELD]: string().required(i18n.t("forms.required_field", { field: i18n.t("code_of_conduct.field.title") }))
  });

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "code_of_conduct",
      fields: [
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.title"),
          name: TITLE_FIELD,
          required: true,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.content"),
          name: CONTENT_FIELD,
          required: true,
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.created_on"),
          name: CREATED_ON_FIELD,
          date_include_time: true,
          type: DATE_FIELD,
          disabled: true
        }),
        FieldRecord({
          display_name: i18n.t("code_of_conduct.field.created_by"),
          name: CREATED_BY_FIELD,
          type: TEXT_FIELD,
          disabled: true
        })
      ]
    })
  ]);
};
