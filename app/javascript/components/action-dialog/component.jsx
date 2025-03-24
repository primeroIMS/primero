// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { useApp } from "../application";

import TitleWithClose from "./components/text-with-close";
import css from "./styles.css";
import { clearDialog } from "./action-creators";
import { getAsyncLoading } from "./selectors";

function ActionDialog({
  cancelButtonProps = {},
  cancelHandler,
  children,
  confirmButtonLabel,
  confirmButtonProps,
  dialogActions,
  dialogSubHeader,
  dialogSubtitle,
  dialogText,
  dialogTitle = "",
  disableActions,
  disableClose = false,
  enabledSuccessButton = true,
  hideIcon = false,
  maxSize,
  omitCloseAfterSuccess,
  onClose,
  open,
  pending,
  showSuccessButton = true,
  successHandler,
  fetchAction,
  fetchArgs = [],
  fetchLoadingPath
}) {
  const dispatch = useDispatch();

  const { disabledApplication } = useApp();

  const asyncLoading = useMemoizedSelector(state => {
    if (!fetchLoadingPath) return false;

    return getAsyncLoading(state, fetchLoadingPath);
  });

  const isPending = asyncLoading || pending;

  const handleClose = (event, reason) => {
    event.stopPropagation();
    if (reason !== "backdropClick") {
      if (cancelHandler) {
        cancelHandler();
      } else if (onClose) {
        onClose();
      } else {
        dispatch(clearDialog());
      }
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
    confirmButtonProps && Object.keys(confirmButtonProps) ? confirmButtonProps : defaultSuccessButtonProps;

  const dialogHeader = (
    <TitleWithClose
      disableClose={disableClose}
      dialogTitle={dialogTitle}
      dialogSubtitle={dialogSubtitle}
      closeHandler={handleClose}
      dialogActions={dialogActions}
    />
  );

  const subHeader = dialogSubHeader && (
    <Typography component="h6" className={css.subHeader}>
      {dialogSubHeader}
    </Typography>
  );

  const iconConfirmButton = confirmButtonProps && confirmButtonProps.icon ? confirmButtonProps.icon : <CheckIcon />;

  const onCloseDialog = disabledApplication ? null : handleClose;

  const submitButton = (
    <div className={css.submitButtonWrapper}>
      <ActionButton
        id="dialog-submit"
        icon={!hideIcon && iconConfirmButton}
        text={confirmButtonLabel}
        type={ACTION_BUTTON_TYPES.default}
        pending={isPending}
        noTranslate
        rest={{
          ...successButtonProps,
          ...(successHandler && { onClick: handleSuccess }),
          disabled: isPending || !enabledSuccessButton
        }}
      />
    </div>
  );

  useEffect(() => {
    if (fetchAction && open) {
      dispatch(fetchAction(...fetchArgs));
    }
  }, [open, fetchAction]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={stopPropagation}>
      <Dialog
        open={open}
        onClose={onCloseDialog}
        maxWidth={maxSize || "sm"}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {dialogHeader}
        {subHeader}
        <DialogContent>{dialogText ? <DialogContentText>{dialogText}</DialogContentText> : children}</DialogContent>
        {!disableActions && (
          <DialogActions>
            {showSuccessButton && submitButton}
            {cancelHandler && (
              <ActionButton
                icon={<CloseIcon />}
                text="cancel"
                type={ACTION_BUTTON_TYPES.default}
                cancel
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
}

ActionDialog.displayName = "ActionDialog";

ActionDialog.propTypes = {
  cancelButtonProps: PropTypes.object,
  cancelHandler: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  confirmButtonLabel: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  dialogActions: PropTypes.object,
  dialogSubHeader: PropTypes.string,
  dialogSubtitle: PropTypes.string,
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disableActions: PropTypes.bool,
  disableClose: PropTypes.bool,
  enabledSuccessButton: PropTypes.bool,
  fetchAction: PropTypes.func,
  fetchArgs: PropTypes.array,
  fetchLoadingPath: PropTypes.array,
  hideIcon: PropTypes.bool,
  maxSize: PropTypes.string,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  showSuccessButton: PropTypes.bool,
  successHandler: PropTypes.func
};

export default ActionDialog;
