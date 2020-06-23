import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Fab, CircularProgress } from "@material-ui/core";

import { useThemeHelper } from "../../../libs";

import styles from "./styles.css";

const FormAction = ({
  actionHandler,
  cancel,
  savingRecord,
  startIcon,
  text
}) => {
  const { css, mobileDisplay } = useThemeHelper(styles);

  const renderCircularProgress = savingRecord && !cancel && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

  const renderText = !mobileDisplay ? text : null;

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
      <span
        className={clsx({
          [css.actionButtonText]: Boolean(startIcon) && !mobileDisplay
        })}
      >
        {renderText}
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
