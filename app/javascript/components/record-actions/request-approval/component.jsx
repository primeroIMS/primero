import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  IconButton,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";

import { approvalRecord } from "./action-creators";
import ApprovalForm from "./approval-form";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({
  close,
  openRequestDialog,
  subMenuItems,
  record,
  recordType,
  pending,
  setPending,
  approvalType,
  confirmButtonLabel,
  dialogName
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const startRequestType = subMenuItems?.[0]?.value;
  const [requestType, setRequestType] = useState(startRequestType);
  const [approval, setApproval] = React.useState("approved");
  const [comment, setComment] = React.useState("");

  const handleChangeType = event => {
    setRequestType(event.target.value);
  };
  const handleChangeApproval = event => {
    setApproval(event.target.value);
  };
  const handleChangeComment = event => {
    setComment(event.target.value);
  };
  const handleCancel = () => {
    close();
    setRequestType(startRequestType);
    setApproval("approved");
    setComment("");
  };

  const actionBody = { data: {} };

  actionBody.data.approval_status =
    approvalType === "request" ? "requested" : approval;

  if (comment !== "") {
    actionBody.data.notes = comment;
  }

  const message =
    approvalType === "request"
      ? `${recordType}.request_approval_success_${requestType}`
      : `${recordType}.${approval}_success_${requestType}`;
  const handleOk = () => {
    setPending(true);

    dispatch(
      approvalRecord({
        recordType,
        recordId: record.get("id"),
        approvalId: requestType,
        body: actionBody,
        message: i18n.t(message),
        failureMessage: i18n.t(`${recordType}.request_approval_failure`),
        dialogName
      })
    );
  };

  const selectOptions = subMenuItems.map(option => (
    <option key={option.value} value={option.value}>
      {option.name}
    </option>
  ));

  const requestDialogContent = (
    <>
      <IconButton
        aria-label="close"
        className={css.closeButton}
        onClick={close}
      >
        <CloseIcon />
      </IconButton>
      <form noValidate autoComplete="off" className={css.centerForm}>
        <FormLabel component="legend">
          {i18n.t(`${recordType}.request_approval_select`)}
        </FormLabel>
        <TextField
          id="outlined-select-approval-native"
          select
          fullWidth
          value={requestType}
          onChange={handleChangeType}
          className={css.selectApprovalType}
          fullWidth
          SelectProps={{
            native: true
          }}
        >
          {selectOptions}
        </TextField>
      </form>
    </>
  );

  const approvalDialogContent = ApprovalForm({
    approval,
    close,
    handleChangeApproval,
    handleChangeComment,
    handleChangeType,
    requestType,
    selectOptions
  });

  const dialogContent =
    approvalType === "approval" ? approvalDialogContent : requestDialogContent;

  return (
    <ActionDialog
      open={openRequestDialog}
      dialogTitle=""
      successHandler={handleOk}
      cancelHandler={handleCancel}
      omitCloseAfterSuccess
      maxSize="xs"
      pending={pending}
      confirmButtonLabel={confirmButtonLabel}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  approvalType: PropTypes.string,
  close: PropTypes.func,
  confirmButtonLabel: PropTypes.string,
  openRequestDialog: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  subMenuItems: PropTypes.array,
  dialogName: PropTypes.string
};

export default Component;
