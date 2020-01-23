import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  menuItem,
  IconButton,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";

import { approvalRecord } from "./action-creators";
import { NAME } from "./constants";
import styles from "./styles.css"

const Component = ({
  close,
  openRequestDialog,
  subMenuItems,
  record,
  recordType,
  approvalType
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const [requestType, setRequestType] = useState("bia");
  const [approval, setApproval] = React.useState("accept");
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

  const handleOk = () => {
    dispatch(
      approvalRecord({
        recordType,
        recordId: record.get("id"),
        approvalId: requestType,
        body: { data: { approval_status: "requested" } },
        message: i18n.t(`cases.request_approval_success_${requestType}`),
        redirect: false
      })
    );

    close();
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
      <form noValidate autoComplete="off">
        <FormLabel component="legend">
          {i18n.t("cases.request_approval_select")}
        </FormLabel>
        <TextField
          id="outlined-select-approval-native"
          select
          value={requestType}
          onChange={handleChangeType}
          className={css.selectApprovalType}
          SelectProps={{
            native: true
          }}
        >
          {selectOptions}
        </TextField>
      </form>
    </>
  );

  const approvalDialogContent = (
    <>
      <IconButton
        aria-label="close"
        className={css.closeButton}
        onClick={close}
      >
        <CloseIcon />
      </IconButton>
      <form noValidate autoComplete="off">
        <FormControl component="fieldset">
          <FormLabel component="legend">{i18n.t("cases.approval_radio")}</FormLabel>
          <RadioGroup aria-label="position" name="position" value={approval} onChange={handleChangeApproval} row>
            <FormControlLabel
              value="accept"
              control={<Radio color="primary" />}
              label={i18n.t("css.request_approval_select")}
              labelPlacement="start"
            />
            <FormControlLabel
              value="reject"
              control={<Radio color="primary" />}
              label={i18n.t("cases.approval_radio_reject")}
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>
        <br/>
        <FormLabel component="legend">{i18n.t("cases.approval_select")}</FormLabel>
        <TextField
          id="outlined-select-approval-native"
          select
          value={requestType}
          onChange={handleChangeType}
          className={css.selectApprovalType}
          SelectProps={{
            native: true,
          }}
        >
          {selectOptions}
        </TextField>
        <br/>
        <br/>
        <FormLabel component="legend">{i18n.t("cases.approval_comments")}</FormLabel>
        <TextField
            id="outlined-multiline-static"
            label=""
            multiline
            rows="4"
            defaultValue=""
            variant="outlined"
            onChange={handleChangeComment}
          />
      </form>
    </>
  );

  const dialogContent = approvalType === "approval" ? approvalDialogContent : requestDialogContent;

  return (
    <ActionDialog
      open={openRequestDialog}
      dialogTitle=""
      successHandler={handleOk}
      cancelHandler={close}
      confirmButtonLabel={i18n.t("cases.ok")}
    >
      {dialogContent}
    </ ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  openRequestDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  subMenuItems: PropTypes.array,
  approvalType: PropTypes.string
};

export default Component;
