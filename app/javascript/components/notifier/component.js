import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

import { useApp } from "../application";
import { useI18n } from "../i18n";
import { RECORD_TYPES } from "../../config";
import { useMemoizedSelector } from "../../libs";

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

const buildMessage = ({ online, messageFromQueue, message, messageKey, messageParams, recordType, i18n }) => {
  const snackMessage = !online && messageFromQueue ? messageFromQueue : message;

  if ((online || !messageFromQueue) && messageKey) {
    const translatedRecordType = recordType ? i18n.t(`${RECORD_TYPES[recordType]}.label`) : "";
    const translatedMessage = i18n.t(messageKey, { record_type: translatedRecordType, ...messageParams });

    if (/^\[missing/.test(translatedMessage)) {
      return messageKey;
    }

    return translatedMessage;
  }

  return snackMessage;
};

const Notifier = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notifications = useMemoizedSelector(state => getMessages(state));

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
        messageDetailed,
        actionLabel,
        actionUrl,
        noDismiss,
        recordType
      } = snack;

      if (dismissed || (!message && !messageKey)) {
        closeSnackbar(key);

        return;
      }

      if (displayed.includes(key)) return;

      const snackMessage = buildMessage({
        online,
        messageFromQueue,
        message,
        messageKey,
        messageParams,
        recordType,
        i18n
      });

      enqueueSnackbar(`${snackMessage}${messageDetailed ? `\n${messageDetailed}` : ""}`, {
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
        ),
        style: { whiteSpace: "pre-line" }
      });

      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

Notifier.displayName = "Notifier";

export default Notifier;
