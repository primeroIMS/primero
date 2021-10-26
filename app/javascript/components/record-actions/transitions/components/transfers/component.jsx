/* eslint-disable react/display-name */
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../../i18n";
import { getErrorsByTransitionType } from "../../selectors";
import { saveTransferUser } from "../../action-creators";
import { TRANSITIONS_TYPES } from "../../../../transitions/constants";
import { useMemoizedSelector } from "../../../../../libs";
import Form from "../../../../form";
import { TRANSFER_FORM_ID } from "../../constants";

import {
  TRANSFER_FIELD,
  REMOTE_SYSTEM_FIELD,
  CONSENT_INDIVIDUAL_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD
} from "./constants";
import { form, validations } from "./form";

const TransferForm = ({
  providedConsent,
  isBulkTransfer,
  canConsentOverride,
  record,
  recordType,
  setPending,
  setDisabled
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const formErrors = useMemoizedSelector(state => getErrorsByTransitionType(state, TRANSITIONS_TYPES.transfer));

  const validationSchema = validations(i18n);

  const initialValues = {
    [TRANSFER_FIELD]: false,
    [REMOTE_SYSTEM_FIELD]: false,
    [CONSENT_INDIVIDUAL_FIELD]: false,
    [AGENCY_FIELD]: "",
    [LOCATION_FIELD]: "",
    [TRANSITIONED_TO_FIELD]: "",
    [NOTES_FIELD]: ""
  };

  const handleSubmit = values => {
    setPending(true);
    dispatch(
      saveTransferUser(
        record.get("id"),
        {
          data: {
            ...values,
            consent_overridden: !providedConsent && canConsentOverride && values[TRANSFER_FIELD]
          }
        },
        i18n.t("transfer.success")
      )
    );
  };

  const forms = form({
    i18n,
    canConsentOverride,
    providedConsent,
    recordType,
    recordModuleID: record?.get("module_id"),
    isBulkTransfer,
    setDisabled
  });

  return (
    <Form
      formID={TRANSFER_FORM_ID}
      submitAllFields
      submitAlways
      formSections={forms}
      onSubmit={handleSubmit}
      validations={validationSchema}
      formErrors={formErrors}
      initialValues={initialValues}
    />
  );
};

TransferForm.propTypes = {
  canConsentOverride: PropTypes.bool,
  isBulkTransfer: PropTypes.bool.isRequired,
  providedConsent: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setDisabled: PropTypes.func,
  setPending: PropTypes.func
};

export default TransferForm;
