import { object, string } from "yup";

export default i18n =>
  object().shape({
    visible: string().required().label(i18n.t("form_export.include_hidden"))
  });
