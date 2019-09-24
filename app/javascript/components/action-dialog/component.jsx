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

const ActionDialog = ({
  open,
  successHandler,
  cancelHandler,
  dialogTitle,
  dialogText,
  confirmButtonLabel
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
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        <DialogTitle id="action-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="action-dialog-description">
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18n.t("cancel")}
          </Button>
          <Button onClick={handleSuccess} color="primary" autoFocus>
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ActionDialog.propTypes = {
  open: PropTypes.bool,
  successHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
  dialogTitle: PropTypes.string,
  dialogText: PropTypes.string,
  confirmButtonLabel: PropTypes.string
};

export default ActionDialog;
