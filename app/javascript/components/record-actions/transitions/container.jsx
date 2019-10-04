import React from "react";
import PropTypes from "prop-types";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";

const Transitions = ({ transitionType, setTransitionType, record }) => {
  const handleClose = () => {
    setTransitionType("");
  };

  const transitionDialogProps = {
    record,
    open: !!transitionType,
    transitionType,
    handleClose
  };

  const referralProps = {
    handleClose
  };

  const reassignProps = {
    recordType: "case",
    record,
    handleClose
  };

  const renderTransitionForm = type => {
    switch (type) {
      case "referral":
        return <ReferralForm {...referralProps} />;
      case "reassign":
        return <ReassignForm {...reassignProps} />;
      case "transfer":
        return <TransferForm />;
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
  transitionType: PropTypes.string,
  setTransitionType: PropTypes.func,
  record: PropTypes.object
};

export default Transitions;
