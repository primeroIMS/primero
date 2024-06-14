// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Dialog, DialogActions, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { ENQUEUE_SNACKBAR, generate } from "../../../../../notifier";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { getReorderIsLoading, getReorderErrors, getReorderPendings } from "../../selectors";

import css from "./styles.css";
import { NAME } from "./constants";

const Component = ({ handleCancel, handleSuccess, open = false }) => {
  const i18n = useI18n();

  const dispatch = useDispatch();

  const reorderLoading = useMemoizedSelector(state => getReorderIsLoading(state));
  const errors = useMemoizedSelector(state => getReorderErrors(state));
  const reorderPendings = useMemoizedSelector(state => getReorderPendings(state));

  useEffect(() => {
    if (open && !reorderLoading) {
      const successful = !errors?.size && !reorderPendings?.size;
      const message = successful ? i18n.t("forms.messages.save_success") : i18n.t("forms.messages.save_with_errors");

      dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: successful ? "success" : "error",
            key: generate.messageKey(message)
          }
        }
      });
    }
  }, [reorderLoading]);

  const icon = !reorderLoading ? <CheckIcon /> : <CircularProgress size={24} className={css.buttonProgress} />;

  return (
    <Dialog id="reorder-actions" disableEnforceFocus open={open} className={css.dialog} hideBackdrop={!reorderLoading}>
      <DialogActions classes={{ root: css.reorderActions }}>
        <ActionButton
          icon={<CloseIcon />}
          text="buttons.cancel"
          type={ACTION_BUTTON_TYPES.default}
          cancel
          rest={{
            onClick: handleCancel,
            disabled: reorderLoading
          }}
        />

        <ActionButton
          icon={icon}
          text="buttons.save_changes"
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: handleSuccess,
            disabled: reorderLoading
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  open: PropTypes.bool
};

export default Component;
