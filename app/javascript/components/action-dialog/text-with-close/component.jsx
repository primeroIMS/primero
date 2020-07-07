import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import { Box, DialogTitle, IconButton } from "@material-ui/core";

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
      <Box display="flex" alignItems="center">
        <Box flexGrow={10}>
          {dialogTitle}
          {subtitle}
        </Box>
        <Box flexGrow={0.5}>{dialogActions}</Box>
        <Box flexGrow={0.5}>
          <IconButton
            aria-label="close"
            className={css.closeButton}
            onClick={closeHandler}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
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
