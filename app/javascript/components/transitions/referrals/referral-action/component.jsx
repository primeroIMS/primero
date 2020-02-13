import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FormLabel, TextField } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import { ActionDialog } from "../../../action-dialog";
import { DONE } from "../constants";

// import { approvalTransfer } from "./action-creators";
import { NAME } from "./constants";

const Component = ({
  openReferralDialog,
  close,
  recordId,
  recordType,
  transistionId
}) => {

  const i18n = useI18n();
  const dispatch = useDispatch();
  const [comment, setComment] = React.useState("");

  const handleChangeComment = event => {
    setComment(event.target.value);
  };

  const handleCancel = (event) => {
    if (event) {
      event.stopPropagation();
    }

    close();
    setComment("");
  };

  const stopProp = (event) => {
    event.stopPropagation();
  };

  // const actionBody = {
  //   data: {
  //     status: approvalType
  //   }
  // };

  const handleOk = () => {
    // dispatch(
    //   approvalTransfer({
    //     body: actionBody,
    //     message,
    //     recordId,
    //     recordType,
    //     transferId
    //   })
    // );

    close();
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };


  const dialogContent = <p>{i18n.t(`${recordType}.referral_done`)}</p>;

  return (
    <ActionDialog
      open={openReferralDialog}
      successHandler={handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      confirmButtonLabel={i18n.t("buttons.done")}
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
  openReferralDialog: PropTypes.bool,
  close: PropTypes.func,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  transistionId: PropTypes.string
};

export default Component;