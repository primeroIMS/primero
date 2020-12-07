import { object, string, ref } from "yup";

import { PASSWORD_MIN_LENGTH } from "../../../../../config";

export default i18n =>
  object().shape({
    password: string()
      .nullable()
      .min(PASSWORD_MIN_LENGTH, i18n.t("errors.models.user.password_length", { min: PASSWORD_MIN_LENGTH }))
      .required(i18n.t("forms.required_field", { field: i18n.t("user.password") }))
      .label(i18n.t("user.password")),
    password_confirmation: string()
      .nullable()
      .min(PASSWORD_MIN_LENGTH, i18n.t("errors.models.user.password_length", { min: PASSWORD_MIN_LENGTH }))
      .oneOf([ref("password"), null], i18n.t("errors.models.user.password_mismatch"))
      .required(i18n.t("forms.required_field", { field: i18n.t("user.password_confirmation") }))
  });
