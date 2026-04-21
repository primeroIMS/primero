import { fromJS } from "immutable";
import { object, ref, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../form";

export const validationSchema = i18n =>
  object().shape({
    user: object().shape({
      password: string().required(i18n.t("forms.required_field", { field: i18n.t("login.password.label") })),
      password_confirmation: string()
        .oneOf([ref("password"), null], i18n.t("login.password_match.label"))
        .required(i18n.t("forms.required_field", { field: i18n.t("login.password_confirmation.label") }))
    })
  });

export const form = (i18n, submit) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "login",
      fields: [
        FieldRecord({
          display_name: i18n.t("login.password.label"),
          name: "user.password",
          type: TEXT_FIELD,
          password: true,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("login.password_confirmation.label"),
          name: "user.password_confirmation",
          type: TEXT_FIELD,
          password: true,
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
