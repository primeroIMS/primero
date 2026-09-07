import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { FormSectionRecord, FieldRecord, TEXT_FIELD, SELECT_FIELD } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { useI18n } from "../../../i18n";
import useOptions from "../../../form/use-options";

import { FORM_REFERRAL_DONE } from "./constants";

function ReferralDoneForm({ formMode, formMethods, serviceOptionStringsSource, serviceRecordId }) {
  const i18n = useI18n();
  const reasonNotSucessfulDefaultOptions = [
    { id: "client_refused_services", display_text: { en: "Client refused services" } },
    { id: "lack_of_capacity", display_text: { en: "Lack of capacity" } },
    { id: "other", display_text: { en: "Other" } },
    { id: "services_no_longer_needed", display_text: { en: "Services no longer needed" } },
    { id: "unable_to_contact_client", display_text: { en: "Unable to contact client" } },
    {
      id: "unable_to_contact_referred_to_organization",
      display_text: { en: "Unable to contact referred-to organization" }
    }
  ];
  const reasonNotSucessfulOptions = useOptions({ source: "lookup lookup-reasons-referral-failure" });

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
              option_strings_text: isEmpty(reasonNotSucessfulOptions)
                ? reasonNotSucessfulDefaultOptions
                : reasonNotSucessfulOptions,
              watchedInputs: "success_status",
              showIf: successStatus => successStatus === "not_successful"
            }),
            FieldRecord({
              display_name: i18n.t("referral.service_implemented"),
              name: "service_implemented",
              type: SELECT_FIELD,
              required: true,
              option_strings_source: serviceOptionStringsSource,
              showIf: () => !!serviceRecordId
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
  serviceOptionStringsSource: PropTypes.string,
  serviceRecordId: PropTypes.string
};

export default ReferralDoneForm;
