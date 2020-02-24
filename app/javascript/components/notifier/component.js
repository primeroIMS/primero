import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { getMessages } from "./selectors";
import { removeSnackbar } from "./action-creators";
import SnackbarAction from "./snackbar-action";

let displayed = [];

const snackbarOptions = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  preventDuplicate: true,
  autoHideDuration: 6000
};

const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => getMessages(state));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = id => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = id => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  const removeMessage = key => {
    dispatch(removeSnackbar(key));
    removeDisplayed(key);
  };

  useEffect(() => {
    notifications.forEach(snack => {
      const {
        options: { key, onClose, action, ...otherOptions },
        dismissed,
        message,
        actionLabel,
        actionUrl
      } = snack;

      if (dismissed) {
        closeSnackbar(key);

        return;
      }

      if (displayed.includes(key)) return;

      enqueueSnackbar(message, {
        ...otherOptions,
        ...snackbarOptions,
        key,
        onExited: (event, snackKey) => {
          removeMessage(snackKey);
        },
        onClose: (event, reason, snackKey) => {
          if (onClose) {
            onClose(event, reason, snackKey);
          }
        },
        // eslint-disable-next-line react/display-name
        action: snackKey => (
          <SnackbarAction
            action={action}
            actionLabel={actionLabel}
            actionUrl={actionUrl}
            closeSnackbar={closeSnackbar}
            key={snackKey}
          />
        )
      });

      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

Notifier.displayName = "Notifier";

export default Notifier;
