import React from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const FormAction = ({ actionHandler, text, cancel }) => {
  const css = makeStyles(styles)();

  return (
    <Fab
      className={cancel ? css.actionButtonCancel : css.actionButton}
      variant="extended"
      aria-label={text}
      onClick={actionHandler}
    >
      {text}
    </Fab>
  );
};

FormAction.displayName = "FormAction";

FormAction.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default FormAction;
