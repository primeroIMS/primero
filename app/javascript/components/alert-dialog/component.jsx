import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

const AlertDialog = ({
  open,
  successHandler,
  cancelHandler,
  title,
  description
}) => {
  const i18n = useI18n();

  const handleClose = () => {
    cancelHandler();
  };

  const handleSuccess = () => {
    successHandler();
    cancelHandler();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title || i18n.t("record_panel.record_information")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description || i18n.t("messages.confirmation_message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18n.t("cancel")}
          </Button>
          <Button onClick={handleSuccess} color="primary" autoFocus>
            {i18n.t("yes_label")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AlertDialog.propTypes = {
  open: PropTypes.bool,
  successHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string
};

export default AlertDialog;
