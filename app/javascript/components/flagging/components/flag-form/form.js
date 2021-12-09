import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_AREA, DATE_FIELD } from "../../../form";

import { MAX_LENGTH_FLAG_REASON } from "./constants";

export const validationSchema = object().shape({
  message: string().required()
});

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "flag",
      fields: [
        FieldRecord({
          display_name: i18n.t("flags.flag_reason"),
          name: "message",
          type: TEXT_AREA,
          required: true,
          help_text: i18n.t("flags.flag_reason_maximun_label"),
          max_length: MAX_LENGTH_FLAG_REASON
        }),
        FieldRecord({
          display_name: i18n.t("flags.flag_date"),
          name: "date",
          type: DATE_FIELD
        })
      ]
    })
  ]);
};
