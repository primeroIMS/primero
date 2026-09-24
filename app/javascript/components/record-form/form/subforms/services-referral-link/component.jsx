import PropTypes from "prop-types";
import { FormHelperText } from "@mui/material";

import { RECORD_TYPES, REFERRAL } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { getRecordInformationNav } from "../../../selectors";
import FormLinkMessage from "../../../components/form-link-message";

import { NAME } from "./constants";

function Component({ recordType, primeroModule }) {
  const canAccessReferrals = useMemoizedSelector(state =>
    getRecordInformationNav(state, { checkVisible: true, recordType: RECORD_TYPES[recordType], primeroModule }).some(
      form => form.formId === REFERRAL
    )
  );

  if (!canAccessReferrals) {
    return null;
  }

  return (
    <FormHelperText data-testid="services-referral-link">
      <FormLinkMessage
        messageKey="referral.services_form_message"
        linkKey="referral.services_form_link"
        formUniqueId={REFERRAL}
      />
    </FormHelperText>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  primeroModule: PropTypes.string,
  recordType: PropTypes.string.isRequired
};

export default Component;
