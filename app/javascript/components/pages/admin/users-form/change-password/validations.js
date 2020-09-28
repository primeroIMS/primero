import { object, string } from "yup";

export default i18n =>
  object().shape({
    password: string().required().label(i18n.t("user.password")),
    password_confirmation: string().required().label(i18n.t("user.password_confirmation"))
  });
