import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FormLabel, TextField } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import { ActionDialog } from "../../../action-dialog";

import { approvalTransfer } from "./action-creators";
import { NAME } from "./constants";
// import { saveExport } from "./action-creators";

const Component = ({
  openTransferDialog,
  close,
  approvalType,
  recordId,
  transferId
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

  const actionBody = {
    data: {
      status: approvalType
    }
  };

  if (approvalType === "rejected") {
    actionBody.data.rejected_reason = comment;
  }

  const message =
    approvalType === "accepted"
    ? i18n.t("cases.transfer_accepted_success")
    : i18n.t("cases.transfer_accepted_rejected", {record_id: recordId});

  const handleOk = () => {
    dispatch(
      approvalTransfer({
        body: actionBody,
        message,
        recordId,
        transferId
      })
    );

    close();
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const commentField = approvalType === "rejected" ? (
    <>
      <FormLabel component="legend">
        {i18n.t("cases.transfer_reject_reason_label")}
      </FormLabel>
      <TextField
        id="outlined-multiline-static"
        label=""
        multiline
        rows="4"
        defaultValue=""
        variant="outlined"
        onChange={handleChangeComment}
      />
    </>
  ): null;

  const dialogContent = (
    <form noValidate autoComplete="off" onClick={stopProp}>
      <p>{i18n.t(`cases.transfer_${approvalType}`)}</p>
      {commentField}
    </form>
  );

  const buttonLabel = approvalType === "accepted" ? "accept" : "reject";

  return (
    <ActionDialog
      open={openTransferDialog}
      successHandler={handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      confirmButtonLabel={i18n.t(`buttons.${buttonLabel}`)}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openTransferDialog: false
};

Component.propTypes = {
  approvalType: PropTypes.string,
  close: PropTypes.func,
  openTransferDialog: PropTypes.bool,
  recordId: PropTypes.string,
  transferId: PropTypes.string
};

export default Component;
