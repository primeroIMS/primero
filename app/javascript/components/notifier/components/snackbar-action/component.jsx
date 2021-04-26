import PropTypes from "prop-types";
import { IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

const Component = ({ action, actionLabel, actionUrl, closeSnackbar, snackKey, hideCloseIcon }) => {
  const handleSnackClose = () => {
    closeSnackbar(snackKey);
  };

  if (action) {
    return <>{action(snackKey, handleSnackClose)}</>;
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
