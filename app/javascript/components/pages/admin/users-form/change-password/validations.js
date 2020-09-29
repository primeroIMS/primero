import { object, string, ref } from "yup";

export default i18n =>
  object().shape({
    password: string().required().label(i18n.t("user.password")),
    password_confirmation: string().oneOf([ref("password"), null], i18n.t("errors.models.user.password_mismatch"))
  });
