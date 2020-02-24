import React from "react";
import PropTypes from "prop-types";
import { IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

const SnackbarAction = ({
  action,
  actionLabel,
  actionUrl,
  closeSnackbar,
  key
}) => {
  const handleSnackClose = () => {
    closeSnackbar(key);
  };

  if (action) {
    return <>{action(key, handleSnackClose)}</>;
  }

  return (
    <>
      {actionLabel && actionUrl ? (
        <Button component={Link} to={actionUrl} color="inherit" size="small">
          {actionLabel}
        </Button>
      ) : null}
      <IconButton onClick={handleSnackClose}>
        <CloseIcon />
      </IconButton>
    </>
  );
};

SnackbarAction.displayName = "SnackbarAction";

SnackbarAction.propTypes = {
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  actionUrl: PropTypes.string,
  closeSnackbar: PropTypes.func.isRequired,
  key: PropTypes.number
};

export default SnackbarAction;
