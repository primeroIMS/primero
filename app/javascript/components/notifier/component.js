import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { useApp } from "../application";
import { useI18n } from "../i18n";
import { RECORD_TYPES } from "../../config";

import { getMessages } from "./selectors";
import { removeSnackbar } from "./action-creators";
import SnackbarAction from "./components/snackbar-action";

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
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();
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
        messageParams,
        messageFromQueue,
        messageKey,
        actionLabel,
        actionUrl,
        noDismiss,
        recordType
      } = snack;

      if (dismissed) {
        closeSnackbar(key);

        return;
      }

      if (displayed.includes(key)) return;

      let snackMessage = online ? message : messageFromQueue;

      if (messageKey) {
        const translatedRecordType = recordType ? i18n.t(`${RECORD_TYPES[recordType]}.label`) : "";
        const translatedMessage = i18n.t(messageKey, { record_type: translatedRecordType, ...messageParams });

        if (/^\[missing/.test(translatedMessage)) {
          snackMessage = messageKey;
        } else {
          snackMessage = translatedMessage;
        }
      }

      enqueueSnackbar(snackMessage, {
        ...{ ...snackbarOptions, autoHideDuration: noDismiss ? null : snackbarOptions.autoHideDuration },
        ...otherOptions,
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
            snackKey={snackKey}
            hideCloseIcon={noDismiss}
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
