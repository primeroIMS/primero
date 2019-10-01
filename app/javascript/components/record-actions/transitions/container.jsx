import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

  const referralProps = {
    setOpen,
    handleClose
  };

  const reassignProps = {
    setOpen,
    handleClose,
    users: [
      { label: "primero" },
      { label: "primero_admin_cp" },
      { label: "primero_cp" },
      { label: "primero_mgr_cp" },
      { label: "primero_gbv" },
      { label: "primero_mgr_gbv" },
      { label: "primero_ftr_manager" },
      { label: "primero_user_mgr_cp" },
      { label: "primero_user_mgr_gbv" },
      { label: "agency_user_admin" }
    ].map(suggestion => ({
      value: suggestion.label.toLowerCase(),
      label: suggestion.label
    }))
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
  record: PropTypes.object,
  setTransitionType: PropTypes.func
};

export default Transitions;
