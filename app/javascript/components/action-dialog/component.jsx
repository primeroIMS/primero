import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress
} from "@material-ui/core";

import { useI18n } from "../i18n";

import TitleWithClose from "./text-with-close";

const ActionDialog = ({
  open,
  successHandler,
  cancelHandler,
  dialogTitle,
  dialogSubtitle,
  dialogText,
  confirmButtonLabel,
  children,
  onClose,
  confirmButtonProps,
  omitCloseAfterSuccess,
  maxSize,
  pending
}) => {
  const i18n = useI18n();

  const handleClose = () => (cancelHandler ? cancelHandler() : onClose());

  const handleSuccess = () => {
    successHandler();
    if (!omitCloseAfterSuccess) handleClose();
  };

  const defaultSuccessButtonProps = {
    color: "primary",
    autoFocus: true
  };

  const successButtonProps =
    confirmButtonProps && Object.keys(confirmButtonProps)
      ? confirmButtonProps
      : defaultSuccessButtonProps;

  const dialogHeader = onClose ? (
    <TitleWithClose
      dialogTitle={dialogTitle}
      dialogSubtitle={dialogSubtitle}
      closeHandler={handleClose}
    />
  ) : (
    <DialogTitle>{dialogTitle}</DialogTitle>
  );

  const submitButton = pending ? (
    <CircularProgress />
  ) : (
    <Button {...{ ...successButtonProps, onClick: handleSuccess }}>
      {confirmButtonLabel}
    </Button>
  );

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={maxSize ? maxSize : "sm"}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {dialogHeader}
        <DialogContent>
          {dialogText ? (
            <DialogContentText>{dialogText}</DialogContentText>
          ) : (
            children
          )}
        </DialogContent>
        <DialogActions>
          {submitButton}
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
  dialogSubtitle: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  maxSize: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
