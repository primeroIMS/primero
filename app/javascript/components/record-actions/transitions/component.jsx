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

const Transitions = ({ transitionType, record, setTransitionType }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    setTransitionType("");
    dispatch(removeFormErrors(transitionType));
  };

  const transitionDialogProps = {
    record,
    open: !!transitionType,
    transitionType,
    handleClose
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
