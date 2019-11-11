import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../i18n";

const ActionDialog = ({
  open,
  successHandler,
  cancelHandler,
  dialogTitle,
  dialogText,
  confirmButtonLabel,
  children,
  onClose
}) => {
  const i18n = useI18n();

  const handleClose = () => (cancelHandler ? cancelHandler() : onClose());

  const handleSuccess = () => {
    successHandler();
    cancelHandler();
  };

  const styles = theme => ({
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

  const TitleWithClose = withStyles(styles)(props => {
    const { classes, closeHandler } = props;

    return (
      <DialogTitle>
        {dialogTitle}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={closeHandler}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    );
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {onClose ? (
          <TitleWithClose closeHandler={handleClose} />
        ) : (
          <DialogTitle>{dialogTitle}</DialogTitle>
        )}

        <DialogContent>
          {dialogText ? (
            <DialogContentText>{dialogText}</DialogContentText>
          ) : (
            children
          )}
        </DialogContent>
        <DialogActions>
          {cancelHandler ? (
            <Button onClick={cancelHandler} color="primary">
              {i18n.t("cancel")}
            </Button>
          ) : null}
          <Button onClick={handleSuccess} color="primary" autoFocus>
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ActionDialog.displayName = "ActionDialog";

ActionDialog.propTypes = {
  cancelHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  confirmButtonLabel: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
