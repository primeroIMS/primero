import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../i18n";

import actionDialogStyles from "./styles.css";

const ActionDialog = ({
  open,
  successHandler,
  cancelHandler,
  dialogTitle,
  dialogTitleSmall,
  dialogText,
  confirmButtonLabel,
  children,
  onClose,
  confirmButtonProps,
  omitCloseAfterSuccess
}) => {
  const i18n = useI18n();
  const css = makeStyles(actionDialogStyles)();

  const handleClose = () => (cancelHandler ? cancelHandler() : onClose());

  const handleSuccess = () => {
    successHandler();
    if (!omitCloseAfterSuccess) handleClose();
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
        <span>
          {dialogTitle}
          {dialogTitleSmall ? (
            <span className={css.dialogTitleSmall}>{dialogTitleSmall}</span>
          ) : null}
        </span>
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

  const defaultSuccessButtonProps = {
    color: "primary",
    autoFocus: true
  };

  const successButtonProps =
    confirmButtonProps && Object.keys(confirmButtonProps)
      ? confirmButtonProps
      : defaultSuccessButtonProps;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
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
          <Button {...{ ...successButtonProps, onClick: handleSuccess }}>
            {confirmButtonLabel}
          </Button>
          {cancelHandler ? (
            <Button onClick={cancelHandler} color="primary">
              {i18n.t("cancel")}
            </Button>
          ) : null}
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
  confirmButtonProps: PropTypes.object,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  dialogTitleSmall: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
