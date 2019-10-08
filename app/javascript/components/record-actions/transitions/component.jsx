import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import users from "./mocked-users";
import {
  TransitionDialog,
  ReferralForm,
  ReassignForm,
  TransferForm
} from "./parts";

const Transitions = ({ transitionType, record, setTransitionType }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (transitionType) {
      setOpen(true);
    }
  });

  const handleClose = () => {
    setOpen(false);
    setTransitionType("");
  };

  const transitionDialogProps = {
    record,
    open,
    transitionType,
    handleClose
  };

  const renderTransitionForm = type => {
    switch (type) {
      case "referral": {
        const referralProps = {
          setOpen,
          handleClose
        };
        return <ReferralForm {...referralProps} />;
      }
      case "reassign": {
        const reassignProps = {
          setOpen,
          handleClose,
          users
        };
        return <ReassignForm {...reassignProps} />;
      }
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
  record: PropTypes.object,
  setTransitionType: PropTypes.func
};

export default Transitions;
