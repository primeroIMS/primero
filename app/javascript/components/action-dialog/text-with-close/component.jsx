import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import { DialogTitle, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({
  dialogTitle,
  dialogSubtitle,
  closeHandler,
  dialogActions
}) => {
  const css = makeStyles(styles)();
  const subtitle = dialogSubtitle ? (
    <span className={css.dialogSubtitle}>{dialogSubtitle}</span>
  ) : null;

  return (
    <DialogTitle>
      <div className={css.dialogTitle}>
        <div>
          {dialogTitle}
          {subtitle}
        </div>
        <div>{dialogActions}</div>
        <div>
          <IconButton
            aria-label="close"
            className={css.closeButton}
            onClick={closeHandler}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </DialogTitle>
  );
};

Component.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  dialogActions: PropTypes.object,
  dialogSubtitle: PropTypes.string,
  dialogTitle: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
