import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { removeFormErrors } from "./action-creators";
import { hasProvidedConsent } from "./parts/helpers";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";

const Transitions = ({
  transitionType,
  record,
  setTransitionType,
  recordType,
  userPermissions
}) => {
  const dispatch = useDispatch();
  const providedConsent = record && hasProvidedConsent(record);

  const handleClose = () => {
    setTransitionType("");
    dispatch(removeFormErrors(transitionType));
  };

  const transitionDialogProps = {
    record,
    open: !!transitionType,
    transitionType,
    handleClose,
    recordType
  };

  const renderTransitionForm = type => {
    switch (type) {
      case "referral": {
        const referralProps = {
          handleClose,
          userPermissions,
          providedConsent,
          recordType,
          record
        };
        return <ReferralForm {...referralProps} />;
      }
      case "reassign": {
        const reassignProps = {
          recordType,
          record,
          handleClose
        };
        return <ReassignForm {...reassignProps} />;
      }
      case "transfer": {
        // TODO: isBulkTransfer should be dynamic once record-actions
        // it's been implemented on <RecordList />
        const transferProps = {
          providedConsent,
          isBulkTransfer: false,
          userPermissions,
          handleClose,
          transitionType,
          record,
          recordType
        };
        return <TransferForm {...transferProps} />;
      }
      default:
        return <></>;
    }
  };

  return (
    <TransitionDialog {...transitionDialogProps}>
      {renderTransitionForm(transitionType)}
    </TransitionDialog>
  );
};

Transitions.propTypes = {
  transitionType: PropTypes.string.isRequired,
  record: PropTypes.object,
  setTransitionType: PropTypes.func.isRequired,
  recordType: PropTypes.string.isRequired,
  userPermissions: PropTypes.object.isRequired
};

export default Transitions;
