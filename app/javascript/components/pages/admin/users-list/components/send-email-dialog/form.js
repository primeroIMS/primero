import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD, TEXT_AREA } from "../../../../../form";

export const validationSchema = ({ labels }) =>
  object().shape({
    message: string().required(labels.message),
    subject: string().required(labels.subject)
  });

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "send_email",
      fields: [
        FieldRecord({
          display_name: i18n.t("users.send_email_subject_label"),
          name: "subject",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("users.send_email_text_label"),
          name: "message",
          type: TEXT_AREA,
          required: true
        })
      ]
    })
  ]);
};
