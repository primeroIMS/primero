import React from "react";
import PropTypes from "prop-types";
import { IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

const SnackbarAction = ({ action, actionLabel, actionUrl, closeSnackbar, key, hideCloseIcon }) => {
  const handleSnackClose = () => {
    closeSnackbar(key);
  };

  if (action) {
    return <>{action(key, handleSnackClose)}</>;
  }

  const showCloseIcon = !hideCloseIcon && (
    <IconButton onClick={handleSnackClose}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <>
      {actionLabel && actionUrl ? (
        <Button component={Link} to={actionUrl} color="inherit" size="small">
          {actionLabel}
        </Button>
      ) : null}
      {showCloseIcon}
    </>
  );
};

SnackbarAction.displayName = "SnackbarAction";

SnackbarAction.propTypes = {
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  actionUrl: PropTypes.string,
  closeSnackbar: PropTypes.func.isRequired,
  hideCloseIcon: PropTypes.bool,
  key: PropTypes.number
};

export default SnackbarAction;
