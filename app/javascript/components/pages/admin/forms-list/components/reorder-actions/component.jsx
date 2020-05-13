import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Button,
  makeStyles,
  Dialog,
  DialogActions,
  CircularProgress
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../../../../i18n";
import { getIsReorderCompleted, getReorderedForms } from "../../selectors";

import styles from "./styles.css";
import { NAME } from "./constants";

const Component = ({ handleCancel, handleSuccess, open }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const reorderCompleted = useSelector(state => getIsReorderCompleted(state));

  return (
    <Dialog
      id="reorder-actions"
      disableEnforceFocus
      open={open}
      style={{ top: "auto", left: "auto" }}
      disableBackdropClick
      hideBackdrop={Boolean(reorderCompleted === true)}
    >
      <DialogActions classes={{ root: css.reorderActions }}>
        <Button
          color="primary"
          className={css.actionButtonCancel}
          onClick={handleCancel}
          disabled={Boolean(reorderCompleted) === false}
        >
          <CloseIcon />
          <span>{i18n.t("buttons.cancel")}</span>
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSuccess}
          disabled={Boolean(reorderCompleted) === false}
        >
          {reorderCompleted ? (
            <CheckIcon />
          ) : (
            <CircularProgress size={24} className={css.buttonProgress} />
          )}
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
