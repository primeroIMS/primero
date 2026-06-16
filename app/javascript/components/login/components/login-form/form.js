import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

export const validationSchema = i18n =>
  object().shape({
    password: string().required().label(i18n.t("login.password.label")),
    user_name: string().required().label(i18n.t("login.username"))
  });

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "login",
      fields: [
        FieldRecord({
          display_name: i18n.t("login.username"),
          name: "user_name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("login.password.label"),
          name: "password",
          type: TEXT_FIELD,
          password: true,
          required: true,
          onKeyPress: event => {
            if (event.key === "Enter") {
              event.target.blur();
            }
          }
        })
      ]
    })
  ]);
};
