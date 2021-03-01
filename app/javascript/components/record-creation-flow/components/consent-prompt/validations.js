import { object, array } from "yup";

export default i18n =>
  object().shape({
    consent_agreements: array().required(i18n.t("case.messages.consent_agreements_required")).min(0),
    legitimate_basis: array().required(i18n.t("case.messages.legitimate_basis_required")).min(0)
  });
