import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { ActionDialog } from "../../../action-dialog";

import { referralDone } from "./action-creators";
import { NAME } from "./constants";
import { DONE } from "../constants";

const Component = ({
  openReferralDialog,
  close,
  dialogName,
  pending,
  setPending,
  recordId,
  recordType,
  transistionId,
  referralType
}) => {

  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleCancel = (event) => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const stopProp = event => {
    event.stopPropagation();
  };

  const message = referralType === DONE ?
    i18n.t(`${recordType}.referral_done_success`) :
    "";

  const handleOk = () => {
    setPending(true);

    dispatch(
      referralDone({
        dialogName,
        message,
        failureMessage: i18n.t(`${recordType}.request_approval_failure`),
        recordId,
        recordType,
        transistionId
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const dialogContent = referralType === DONE ?
    (<div onClick={stopProp}><p>{i18n.t(`${recordType}.referral_done`)}</p></div>) :
    "";
  const confirmButtonLabel = referralType === DONE ?
    "buttons.done" :
    "buttons.ok";


  return (
    <ActionDialog
      open={openReferralDialog}
      successHandler={handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t(confirmButtonLabel)}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openReferralDialog: false
};

Component.propTypes = {
  close: PropTypes.func,
  dialogName: PropTypes.string,
  openReferralDialog: PropTypes.bool,
  pending: PropTypes.bool,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  transistionId: PropTypes.string,
  referralType: PropTypes.string
};

export default Component;
