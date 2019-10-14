import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { removeFormErrors } from "./action-creators";
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
          handleClose
        };
        return <ReferralForm {...referralProps} />;
      }
      case "reassign": {
        const reassignProps = {
          recordType: "case",
          record,
          handleClose
        };
        return <ReassignForm {...reassignProps} />;
      }
      case "transfer": {
        // TODO: providedConsent should set once user it's been fetched
        // TODO: isBulkTransfer should be dynamic once record-actions
        // it's been implemented on <RecordList />
        const transferProps = {
          providedConsent: false,
          isBulkTransfer: false,
          userPermissions,
          handleClose,
          transitionType
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
  record: PropTypes.object.isRequired,
  setTransitionType: PropTypes.func.isRequired,
  recordType: PropTypes.string.isRequired,
  userPermissions: PropTypes.object.isRequired
};

export default Transitions;
