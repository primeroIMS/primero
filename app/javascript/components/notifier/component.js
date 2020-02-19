import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

import { getMessages } from "./selectors";
import { removeSnackbar, closeSnackbar } from "./action-creators";

class Notifier extends Component {
  constructor(props) {
    super(props);

    this.displayed = [];
  }

  shouldComponentUpdate({ messages: newSnacks = [] }) {
    if (!newSnacks.size) {
      this.displayed = [];

      return false;
    }

    const {
      messages: currentSnacks,
      closeSnackbar: closeSnack,
      removeSnackbar: removeSnack
    } = this.props;

    let notExists = false;

    newSnacks.forEach(snack => {
      const { options, dismissed } = snack;

      if (dismissed) {
        closeSnack(options.key);
        removeSnack(options.key);
      }

      if (notExists) return;

      notExists =
        notExists ||
        !currentSnacks.filter(({ options: { key } }) => options.key === key)
          .size;
    });

    return notExists;
  }

  componentDidUpdate() {
    const {
      messages,
      dismissSnackbar,
      enqueueSnackbar: enqueueSnack
    } = this.props;

    messages.forEach(m => {
      const { message, options, actionLabel, actionUrl } = m;

      if (this.displayed.includes(options.key)) {
        return;
      }

      enqueueSnack(message, {
        ...options,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center"
        },
        preventDuplicate: true,
        autoHideDuration: 6000,
        action: key => {
          const handleSnackClose = () => {
            dismissSnackbar(key);
          };

          if (options.action) {
            return <>{options.action(key, handleSnackClose)}</>;
          }

          return (
            <>
              {actionLabel && actionUrl ? (
                <Button
                  component={Link}
                  to={actionUrl}
                  color="inherit"
                  size="small"
                >
                  {actionLabel}
                </Button>
              ) : null}
              <IconButton onClick={handleSnackClose}>
                <CloseIcon />
              </IconButton>
            </>
          );
        },
        onClose: (event, reason, key) => {
          if (options.onClose) {
            options.onClose(event, reason, key);
          }

          removeSnackbar(options.key);
        }
      });

      this.storeDisplayed(options.key);
    });
  }

  storeDisplayed(id) {
    this.displayed = [...this.displayed, id];
  }

  render() {
    return null;
  }
}

Notifier.displayName = "Notifier";

Notifier.propTypes = {
  closeSnackbar: PropTypes.func.isRequired,
  dismissSnackbar: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  messages: PropTypes.object,
  removeSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  messages: getMessages(state)
});

const mapDispatchToProps = {
  removeSnackbar,
  dismissSnackbar: closeSnackbar
};

export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifier)
);
