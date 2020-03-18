import React from "react";
import PropTypes from "prop-types";
import { Fab, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const FormAction = ({ actionHandler, text, cancel, savingRecord }) => {
  const css = makeStyles(styles)();

  const renderCircularProgress = savingRecord && !cancel && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

  return (
    <Fab
      className={cancel ? css.actionButtonCancel : css.actionButton}
      variant="extended"
      aria-label={text}
      onClick={actionHandler}
      disabled={savingRecord}
    >
      {renderCircularProgress}
      {text}
    </Fab>
  );
};

FormAction.displayName = "FormAction";

FormAction.defaultProps = {
  savingRecord: false
};

FormAction.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
  savingRecord: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default FormAction;
