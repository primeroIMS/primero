import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import submitForm from "../../../libs/submit-form";
import { TRANSITIONS_TYPES } from "../../transitions/constants";

import { NAME } from "./constants";
import { hasProvidedConsent } from "./components/utils";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./components";

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
  const providedConsent = (record && hasProvidedConsent(record)) || false;
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

  const commonTransitionProps = {
    userPermissions,
    providedConsent,
    recordType,
    record,
    setPending
  };

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const transitionComponent = t => {
    if (t.transferDialog) {
      return (
        <TransferForm
          {...commonTransitionProps}
          isBulkTransfer={false}
          transferRef={transferFormikRef}
          disabled={disabledTransferButton}
          setDisabled={setDisabledTransferButton}
        />
      );
    }
    if (t.referDialog) {
      return (
        <ReferralForm
          {...commonTransitionProps}
          referralRef={referralFormikRef}
          disabled={disabledReferButton}
          setDisabled={setDisabledReferButton}
        />
      );
    }
    if (t.assignDialog) {
      return (
        <ReassignForm {...commonTransitionProps} assignRef={assignFormikRef} />
      );
    }

    return null;
  };

  const renderTransitionForm = () => {
    if (referDialog) {
      const referralOnClose = () => {
        setDisabledReferButton(false);
        handleReferClose();
      };

      return {
        onClose: referralOnClose,
        confirmButtonLabel: i18n.t("buttons.referral"),
        open: referDialog,
        successHandler: () => submitForm(referralFormikRef),
        transitionType: TRANSITIONS_TYPES.referral,
        enabledSuccessButton: disabledReferButton || providedConsent
      };
    }

    if (transferDialog) {
      const transferOnClose = () => {
        setDisabledTransferButton(false);
        handleTransferClose();
      };

      return {
        onClose: transferOnClose,
        confirmButtonLabel: i18n.t("buttons.transfer"),
        open: transferDialog,
        successHandler: () => submitForm(transferFormikRef),
        transitionType: TRANSITIONS_TYPES.transfer,
        enabledSuccessButton: disabledTransferButton || providedConsent
      };
    }

    if (assignDialog) {
      return {
        onClose: handleAssignClose,
        confirmButtonLabel: i18n.t("buttons.save"),
        open: assignDialog,
        successHandler: () => submitForm(assignFormikRef),
        transitionType: TRANSITIONS_TYPES.reassign
      };
    }

    return null;
  };

  const customProps = renderTransitionForm();

  if (Object.is(customProps, null)) {
    return null;
  }

  return (
    <TransitionDialog {...customProps} {...commonDialogProps}>
      {transitionComponent({  assignDialog, referDialog, transferDialog })}
    </TransitionDialog>
  );
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
  transferDialog: PropTypes.bool,
  userPermissions: PropTypes.object.isRequired
};

export default Transitions;
