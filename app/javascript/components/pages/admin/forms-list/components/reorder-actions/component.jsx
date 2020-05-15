import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  makeStyles,
  Dialog,
  DialogActions,
  CircularProgress
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { ENQUEUE_SNACKBAR, generate } from "../../../../../notifier";
import { useI18n } from "../../../../../i18n";
import { compare } from "../../../../../../libs";
import {
  getReorderIsLoading,
  getReorderErrors,
  getReorderPendings
} from "../../selectors";

import styles from "./styles.css";
import { NAME } from "./constants";

const Component = ({ handleCancel, handleSuccess, open }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const reorderLoading = useSelector(state => getReorderIsLoading(state));
  const errors = useSelector(state => getReorderErrors(state), compare);
  const reorderPendings = useSelector(
    state => getReorderPendings(state),
    compare
  );

  useEffect(() => {
    if (open && !reorderLoading) {
      const successful = !errors?.size && !reorderPendings?.size;

      dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          message: successful
            ? "Everything was saved correctly"
            : "Not all forms could be saved.",
          options: {
            variant: successful ? "success" : "error",
            key: generate.messageKey()
          }
        }
      });
    }
  }, [reorderLoading]);

  const icon = !reorderLoading ? (
    <CheckIcon />
  ) : (
    <CircularProgress size={24} className={css.buttonProgress} />
  );

  return (
    <Dialog
      id="reorder-actions"
      disableEnforceFocus
      open={open}
      style={{ top: "auto", left: "auto" }}
      disableBackdropClick
      hideBackdrop={!reorderLoading}
    >
      <DialogActions classes={{ root: css.reorderActions }}>
        <Button
          color="primary"
          className={css.actionButtonCancel}
          onClick={handleCancel}
          disabled={reorderLoading}
        >
          <CloseIcon />
          <span>{i18n.t("buttons.cancel")}</span>
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSuccess}
          disabled={reorderLoading}
        >
          {icon}
          <span>{i18n.t("buttons.save_changes")}</span>
        </Button>
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
