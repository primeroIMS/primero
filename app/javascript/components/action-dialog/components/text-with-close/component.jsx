// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton } from "@mui/material";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ dialogTitle, dialogSubtitle, closeHandler, dialogActions, disableClose = false }) => {
  const subtitle = dialogSubtitle ? <span className={css.dialogSubtitle}>{dialogSubtitle}</span> : null;

  return (
    <DialogTitle>
      <div className={css.dialogTitle}>
        <div>
          {dialogTitle}
          {subtitle}
        </div>
        <div>{dialogActions}</div>
        {disableClose || (
          <div>
            <IconButton aria-label="close" className={css.closeButton} onClick={closeHandler}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>
    </DialogTitle>
  );
};

Component.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  dialogActions: PropTypes.object,
  dialogSubtitle: PropTypes.string,
  dialogTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  disableClose: PropTypes.bool
};

Component.displayName = NAME;

export default Component;
