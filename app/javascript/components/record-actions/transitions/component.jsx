import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import submitForm from "../../../libs/submit-form";
import { TRANSITIONS_TYPES } from "../../transitions/constants";

import { NAME } from "./constants";
import { hasProvidedConsent } from "./parts/helpers";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";

const Transitions = ({
  record,
  recordType,
  userPermissions,
  referDialog,
  assignDialog,
  transferDialog,
  handleReferClose,
  handleAssignClose,
  handleTransferClose,
  pending,
  setPending
}) => {
  const i18n = useI18n();
  const providedConsent = record && hasProvidedConsent(record);
  const referralFormikRef = useRef();
  const transferFormikRef = useRef();
  const assignFormikRef = useRef();
  const [disabledReferButton, setDisabledReferButton] = useState(false);
  const [disabledTransferButton, setDisabledTransferButton] = useState(false);

  const commonDialogProps = {
    omitCloseAfterSuccess: true,
    pending,
    record,
    recordType
  };

  // eslint-disable-next-line react/display-name
  const renderTransitionForm = () => {
    if (referDialog) {
      const referralOnClose = () => {
        setDisabledReferButton(false);
        handleReferClose();
      };

      return (
        <TransitionDialog
          onClose={referralOnClose}
          confirmButtonLabel={i18n.t("buttons.referral")}
          open={referDialog}
          successHandler={() => submitForm(referralFormikRef)}
          transitionType={TRANSITIONS_TYPES.referral}
          disableSuccess={disabledReferButton || providedConsent}
          {...commonDialogProps}
        >
          <ReferralForm
            userPermissions={userPermissions}
            providedConsent={providedConsent}
            recordType={recordType}
            record={record}
            referralRef={referralFormikRef}
            setPending={setPending}
            disabled={disabledReferButton}
            setDisabled={setDisabledReferButton}
          />
        </TransitionDialog>
      );
    }

    if (transferDialog) {
      const transferOnClose = () => {
        setDisabledTransferButton(false);
        handleTransferClose();
      };

      return (
        <TransitionDialog
          onClose={transferOnClose}
          confirmButtonLabel={i18n.t("buttons.transfer")}
          open={transferDialog}
          successHandler={() => submitForm(transferFormikRef)}
          transitionType={TRANSITIONS_TYPES.transfer}
          disableSuccess={disabledTransferButton || providedConsent}
          {...commonDialogProps}
        >
          <TransferForm
            providedConsent={providedConsent}
            isBulkTransfer={false}
            userPermissions={userPermissions}
            record={record}
            recordType={recordType}
            transferRef={transferFormikRef}
            setPending={setPending}
            disabled={disabledTransferButton}
            setDisabled={setDisabledTransferButton}
          />
        </TransitionDialog>
      );
    }

    if (assignDialog) {
      return (
        <TransitionDialog
          onClose={handleAssignClose}
          confirmButtonLabel={i18n.t("buttons.save")}
          open={assignDialog}
          successHandler={() => submitForm(assignFormikRef)}
          transitionType={TRANSITIONS_TYPES.reassign}
          disableSuccess
          {...commonDialogProps}
        >
          <ReassignForm
            record={record}
            recordType={recordType}
            setPending={setPending}
            assignRef={assignFormikRef}
          />
        </TransitionDialog>
      );
    }

    return null;
  };

  return renderTransitionForm();
};

Transitions.displayName = NAME;

Transitions.propTypes = {
  assignDialog: PropTypes.bool,
  handleAssignClose: PropTypes.func,
  handleReferClose: PropTypes.func,
  handleTransferClose: PropTypes.func,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  referDialog: PropTypes.bool,
  setPending: PropTypes.func,
  setTransitionType: PropTypes.func.isRequired,
  transferDialog: PropTypes.bool,
  transitionType: PropTypes.string.isRequired,
  userPermissions: PropTypes.object.isRequired
};

export default Transitions;
