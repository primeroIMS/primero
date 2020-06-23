import React from "react";
import PropTypes from "prop-types";
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
  Typography
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../i18n";
import { useThemeHelper } from "../../libs";

import TitleWithClose from "./text-with-close";
import styles from "./styles.css";

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
  pending,
  enabledSuccessButton,
  dialogSubHeader,
  cancelButtonProps,
  disableActions
}) => {
  const i18n = useI18n();
  const { css, mobileDisplay } = useThemeHelper(styles);

  const handleClose = event => {
    event.stopPropagation();
    if (cancelHandler) {
      cancelHandler();
    } else {
      onClose();
    }
  };

  const handleSuccess = event => {
    event.stopPropagation();
    successHandler();
    if (!omitCloseAfterSuccess) handleClose(event);
  };

  const stopPropagation = event => event.stopPropagation();

  const defaultSuccessButtonProps = {
    autoFocus: true
  };

  const defaulCancelButtonProps = {
    autoFocus: false
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
    <DialogTitle className={css.dialogTitle}>{dialogTitle}</DialogTitle>
  );

  const subHeader = dialogSubHeader && (
    <Typography component="h6" className={css.subHeader}>
      {dialogSubHeader}
    </Typography>
  );

  const iconConfirmButtom =
    confirmButtonProps && confirmButtonProps.icon ? (
      confirmButtonProps.icon
    ) : (
      <CheckIcon />
    );

  const renderConfirmText = !mobileDisplay ? confirmButtonLabel : null;
  const submitButton = (
    <div className={css.submitButtonWrapper}>
      <Fab
        {...{ ...successButtonProps, onClick: handleSuccess }}
        disabled={pending || !enabledSuccessButton}
        variant="extended"
        className={css.actionButton}
      >
        {iconConfirmButtom}
        {renderConfirmText}
      </Fab>
      {pending && <CircularProgress size={24} className={css.buttonProgress} />}
    </div>
  );

  const renderCancelText = !mobileDisplay ? i18n.t("cancel") : null;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div onClick={stopPropagation}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={maxSize || "sm"}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {dialogHeader}
        {subHeader}
        <DialogContent>
          {dialogText ? (
            <DialogContentText>{dialogText}</DialogContentText>
          ) : (
            children
          )}
        </DialogContent>
        {disableActions || (
          <DialogActions>
            {submitButton}
            {cancelHandler && (
              <Fab
                {...{ ...defaulCancelButtonProps, ...cancelButtonProps }}
                onClick={cancelHandler}
                variant="extended"
                className={css.actionButtonCancel}
              >
                <CloseIcon />
                {renderCancelText}
              </Fab>
            )}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

ActionDialog.displayName = "ActionDialog";

ActionDialog.defaultProps = {
  cancelButtonProps: {},
  enabledSuccessButton: true
};

ActionDialog.propTypes = {
  cancelButtonProps: PropTypes.object,
  cancelHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  confirmButtonLabel: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  dialogSubHeader: PropTypes.string,
  dialogSubtitle: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  disableActions: PropTypes.bool,
  enabledSuccessButton: PropTypes.bool,
  maxSize: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
