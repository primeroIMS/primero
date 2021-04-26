import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles, Dialog, DialogActions, CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { ENQUEUE_SNACKBAR, generate } from "../../../../../notifier";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { getReorderIsLoading, getReorderErrors, getReorderPendings } from "../../selectors";

import styles from "./styles.css";
import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ handleCancel, handleSuccess, open }) => {
  const i18n = useI18n();
  const css = useStyles();
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
    <Dialog
      id="reorder-actions"
      disableEnforceFocus
      open={open}
      className={css.dialog}
      disableBackdropClick
      hideBackdrop={!reorderLoading}
    >
      <DialogActions classes={{ root: css.reorderActions }}>
        <ActionButton
          icon={<CloseIcon />}
          text={i18n.t("buttons.cancel")}
          type={ACTION_BUTTON_TYPES.default}
          isCancel
          rest={{
            onClick: handleCancel,
            disabled: reorderLoading
          }}
        />

        <ActionButton
          icon={icon}
          text={i18n.t("buttons.save_changes")}
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

Component.defaultProps = {
  open: false
};

Component.propTypes = {
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  open: PropTypes.bool
};

export default Component;
