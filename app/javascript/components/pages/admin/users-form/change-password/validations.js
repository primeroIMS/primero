import { object, string, lazy, ref } from "yup";
import isEmpty from "lodash/isEmpty";

export default i18n =>
  object().shape({
    password: lazy(value => {
      const defaultValidation = value ? string().min(8) : string();

      return defaultValidation.required().label(i18n.t("user.password"));
    }),
    password_confirmation: lazy(value => {
      const defaultValidation = string().oneOf([ref("password"), null], i18n.t("errors.models.user.password_mismatch"));

      if (isEmpty(value)) {
        return defaultValidation.required().label(i18n.t("user.password_confirmation"));
      }

      return defaultValidation;
    })
  });
