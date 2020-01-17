import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField, menuItem, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";
import { saveRecord } from "../../records";

import { NAME } from "./constants";

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

const Component = ({ close, openRequestDialog, subMenuItems, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const enableState =
    record && !record.get("record_state") ? "enable" : "disable";
  const setValue = record ? !record.get("record_state") : true;
  const handleOk = () => {
    // call api to request approval here
    close();
  };

  const classes = useStyles();
  const [requestType, setRequestType] = React.useState('approve_bia');
  const handleChange = event => {
    setRequestType(event.target.value);
  };

  const dialogContent = (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="outlined-select-approval-native"
        select
        label={i18n.t("cases.request_approval_select")}
        value={requestType}
        onChange={handleChange}
        SelectProps={{
          native: true,
        }}
      >
        {subMenuItems.map(option => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </TextField>
      <p>{i18n.t(`cases.request_${requestType}`)} </p>
    </form>
  );

  const dialogTitle = (
    <IconButton aria-label="close" className={classes.closeButton} onClick={close}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <ActionDialog
      open={openRequestDialog}
      dialogTitle={dialogTitle}
      successHandler={handleOk}
      cancelHandler={close}
      children={dialogContent}
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  openRequestDialog: PropTypes.bool,
  subMenuItems: PropTypes.array,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default Component;