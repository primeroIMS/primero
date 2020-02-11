import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  menuItem,
  IconButton,
  FormLabel
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";

import { approvalRecord } from "./action-creators";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({
  close,
  openRequestDialog,
  subMenuItems,
  record,
  recordType,
  pending,
  setPending
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const startRequestType = subMenuItems?.[0]?.value;
  const [requestType, setRequestType] = useState(startRequestType);
  const handleChange = event => {
    setRequestType(event.target.value);
  };

  const handleOk = () => {
    setPending(true);

    dispatch(
      approvalRecord({
        recordType,
        recordId: record.get("id"),
        approvalId: requestType,
        body: { data: { approval_status: "requested" } },
        message: i18n.t(`${recordType}.request_approval_success_${requestType}`),
        failureMessage: i18n.t(`${recordType}.request_approval_failure`)
      })
    );
  };
  const handleCancel = () => {
    setRequestType(startRequestType);
    close();
  };

  const selectOptions = subMenuItems.map(option => (
    <option key={option.value} value={option.value}>
      {option.name}
    </option>
  ));

  const dialogContent = (
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
          value={requestType}
          onChange={handleChange}
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

  return (
    <ActionDialog
      open={openRequestDialog}
      dialogTitle=""
      successHandler={handleOk}
      cancelHandler={handleCancel}
      confirmButtonLabel={i18n.t("buttons.ok")}
      omitCloseAfterSuccess
      maxSize="xs"
      pending={pending}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  openRequestDialog: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  subMenuItems: PropTypes.array
};

export default Component;
