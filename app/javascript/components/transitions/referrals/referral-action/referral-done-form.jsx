import PropTypes from "prop-types";

import { FormSectionRecord, FieldRecord, TEXT_FIELD, SELECT_FIELD } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { useI18n } from "../../../i18n";

import { FORM_REFERRAL_DONE } from "./constants";

function ReferralDoneForm({ formMode, formMethods, serviceImplementedField }) {
  const i18n = useI18n();

  return (
    <form id={FORM_REFERRAL_DONE}>
      <FormSection
        formMode={formMode}
        formMethods={formMethods}
        formSection={FormSectionRecord({
          unique_id: "referral_done",
          fields: [
            FieldRecord({
              display_name: i18n.t("referral.notes_on_referral"),
              name: "rejection_note",
              type: TEXT_FIELD,
              autoFocus: true
            }),
            FieldRecord({
              display_name: i18n.t("referral.success_status"),
              name: "success_status",
              type: SELECT_FIELD,
              required: true,
              option_strings_text: [
                { id: "successful", display_text: i18n.t("referral.success_status_options.successful") },
                {
                  id: "not_successful",
                  display_text: i18n.t("referral.success_status_options.not_successful")
                }
              ]
            }),
            FieldRecord({
              display_name: i18n.t("referral.reason_not_successful"),
              name: "reason_not_successful",
              type: SELECT_FIELD,
              required: true,
              option_strings_source: "lookup lookup-reasons-referral-failure",
              watchedInputs: "success_status",
              showIf: successStatus => successStatus === "not_successful"
            }),
            FieldRecord({
              display_name: i18n.t("referral.service_implemented"),
              name: "service_implemented",
              type: SELECT_FIELD,
              required: true,
              option_strings_source: serviceImplementedField?.option_strings_source
            })
          ]
        })}
        showTitle={false}
      />
    </form>
  );
}

ReferralDoneForm.displayName = "ReferralDoneForm";

ReferralDoneForm.propTypes = {
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.string.isRequired,
  serviceImplementedField: PropTypes.object
};

export default ReferralDoneForm;
