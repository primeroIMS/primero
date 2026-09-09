import PropTypes from "prop-types";

import { FormSectionRecord, FieldRecord, TEXT_FIELD } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { useI18n } from "../../../i18n";

import { FORM_ID } from "./constants";

function RejectedReferralForm({ formMode, formMethods }) {
  const i18n = useI18n();

  return (
    <form id={FORM_ID}>
      <FormSection
        formSection={FormSectionRecord({
          unique_id: "rejected_form",
          fields: [
            FieldRecord({
              display_name: i18n.t("referral.rejected_reason"),
              name: "rejected_reason",
              type: TEXT_FIELD,
              autoFocus: true
            })
          ]
        })}
        showTitle={false}
        formMethods={formMethods}
        formMode={formMode}
      />
    </form>
  );
}

RejectedReferralForm.displayName = "RejectedReferralForm";

RejectedReferralForm.propTypes = {
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.string.isRequired
};

export default RejectedReferralForm;
