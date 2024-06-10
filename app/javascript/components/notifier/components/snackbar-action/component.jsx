// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const Component = ({ action, actionLabel, actionUrl, closeSnackbar, snackKey, hideCloseIcon }) => {
  const handleSnackClose = () => {
    closeSnackbar(snackKey);
  };

  if (action) {
    return <>{action(snackKey, handleSnackClose)}</>;
  }

  const showCloseIcon = !hideCloseIcon && (
    <IconButton size="large" onClick={handleSnackClose}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <>
      {actionLabel && actionUrl ? (
        <Button
          id="snackbar-action"
          data-testid="snackbar-action"
          component={Link}
          to={actionUrl}
          color="inherit"
          size="small"
        >
          {actionLabel}
        </Button>
      ) : null}
      {showCloseIcon}
    </>
  );
};

Component.displayName = "SnackbarAction";

Component.propTypes = {
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  actionUrl: PropTypes.string,
  closeSnackbar: PropTypes.func.isRequired,
  hideCloseIcon: PropTypes.bool,
  snackKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Component;
