import { object, string, ref } from "yup";

export default i18n =>
  object().shape({
    password: string()
      .nullable()
      .min(8, i18n.t("errors.models.user.password_length", { min: 8 }))
      .required(i18n.t("forms.required_field", { field: i18n.t("user.password") }))
      .label(i18n.t("user.password")),
    password_confirmation: string()
      .nullable()
      .min(8, i18n.t("errors.models.user.password_length", { min: 8 }))
      .oneOf([ref("password"), null], i18n.t("errors.models.user.password_mismatch"))
      .required(i18n.t("forms.required_field", { field: i18n.t("user.password_confirmation") }))
  });
