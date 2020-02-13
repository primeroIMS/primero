import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
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
  omitCloseAfterSuccess
}) => {
  const i18n = useI18n();

  const handleClose = event => {
    event.stopPropagation();
    cancelHandler ? cancelHandler() : onClose();
  };

  const handleSuccess = event => {
    event.stopPropagation();
    successHandler();
    if (!omitCloseAfterSuccess) handleClose(event);
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
        {dialogHeader}
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
  dialogSubtitle: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
