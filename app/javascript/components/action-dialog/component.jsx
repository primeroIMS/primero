import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../i18n";
import { useThemeHelper } from "../../libs";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

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
  disableActions,
  disableBackdropClick
}) => {
  const i18n = useI18n();
  const { css } = useThemeHelper(styles);

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

  const submitButton = (
    <div className={css.submitButtonWrapper}>
      <ActionButton
        icon={iconConfirmButtom}
        text={confirmButtonLabel}
        type={ACTION_BUTTON_TYPES.default}
        pending={pending}
        rest={{
          ...successButtonProps,
          onClick: handleSuccess,
          disabled: pending || !enabledSuccessButton
        }}
      />
    </div>
  );

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
        disableBackdropClick={disableBackdropClick}
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
              <ActionButton
                icon={<CloseIcon />}
                text={i18n.t("cancel")}
                type={ACTION_BUTTON_TYPES.default}
                isCancel
                rest={{
                  ...defaulCancelButtonProps,
                  ...cancelButtonProps,
                  onClick: cancelHandler
                }}
              />
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
  disableBackdropClick: false,
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
  disableBackdropClick: PropTypes.bool,
  enabledSuccessButton: PropTypes.bool,
  maxSize: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
