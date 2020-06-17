import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Fab, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./styles.css";

const FormAction = ({
  actionHandler,
  cancel,
  savingRecord,
  startIcon,
  text
}) => {
  const css = makeStyles(styles)();

  const renderCircularProgress = savingRecord && !cancel && (
    <CircularProgress size={10} value={25} className={css.loadingMargin} />
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
      {startIcon}
      <span className={clsx({ [css.actionButtonText]: Boolean(startIcon) })}>
        {text}
      </span>
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
  startIcon: PropTypes.object,
  text: PropTypes.string.isRequired
};

export default FormAction;
