import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useI18n } from "../../i18n";
import { whichFormMode } from "../../form";

import { createValidationSchema } from "./utils";

function useReferralForm({ defaultValues, mode, status, serviceRecordId }) {
  const i18n = useI18n();
  const validationSchema = createValidationSchema(status, serviceRecordId, {
    rejected_reason: i18n.t("form_section.required_field", { field: i18n.t("referral.rejected_reason") }),
    success_status: i18n.t("form_section.required_field", {
      field: i18n.t("referral.success_status")
    }),
    reason_not_successful: i18n.t("form_section.required_field", { field: i18n.t("referral.reason_not_successful") }),
    service_implemented: i18n.t("form_section.required_field", {
      field: i18n.t("referral.service_implemented")
    })
  });

  const methods = useForm({
    defaultValues,
    ...(validationSchema ? { resolver: yupResolver(validationSchema) } : {}),
    mode: "onsubmit"
  });

  const formMode = whichFormMode(mode);

  return { methods, formMode };
}

export default useReferralForm;
