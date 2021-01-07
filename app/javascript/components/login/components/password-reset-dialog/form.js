import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

export const validationSchema = i18n =>
  object().shape({
    email: string().required().label(i18n.t("login.password_reset_email"))
  });

export const form = (i18n, submit) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "password_reset_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("login.password_reset_email"),
          name: "email",
          type: TEXT_FIELD,
          required: true,
          onKeyPress: e => {
            if (e.key === "Enter") {
              submit();
            }
          }
        })
      ]
    })
  ]);
};
