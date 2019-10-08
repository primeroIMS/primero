import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import styles from "../styles.css";

const TransitionDialog = ({
  open,
  transitionType,
  record,
  children,
  handleClose
}) => {
  const css = makeStyles(styles)();

  const title = (type => {
    if (record) {
      const { case_id_display: caseId } = record.toJS();
      switch (type) {
        case "referral":
          return `Referral Case ${caseId}`;
        case "reassign":
          return `Assign Case ${caseId}`;
        case "transfer":
          return `Transfer Case ${caseId}`;
        default:
          return null;
      }
    }
    return "";
  })(transitionType);

  const dialogProps = {
    open,
    maxWidth: "sm",
    fullWidth: true,
    onClose: handleClose
  };

  return (
    <Dialog {...dialogProps} classes={{ paper: css.autoCompleteOverflow }}>
      <DialogTitle id="customized-dialog-title" className={css.modalTitle}>
        <span>{title}</span>
        <IconButton onClick={handleClose}>
          <Clear />
        </IconButton>
      </DialogTitle>
      <DialogContent className={css.autoCompleteOverflow}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

TransitionDialog.propTypes = {
  children: PropTypes.node.isRequired,
  record: PropTypes.object,
  open: PropTypes.bool.isRequired,
  transitionType: PropTypes.string,
  handleClose: PropTypes.func.isRequired
};

export default TransitionDialog;
