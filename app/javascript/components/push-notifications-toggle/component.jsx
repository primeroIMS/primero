import { FormControlLabel, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { NOTIFICATION_PERMISSIONS, POST_MESSAGES } from "../../config";
import { cleanupSubscriptions } from "../../libs/service-worker-utils";
import { useI18n } from "../i18n";

import css from "./styles.css";

function Component() {
  const [value, setValue] = useState(Boolean(localStorage.getItem("pushEndpoint")));
  const i18n = useI18n();
  const notificationsNotSupported = !("Notification" in window);

  const handleSwitch = event => {
    const isNotificationsGranted = event.target.checked;

    if (!value && isNotificationsGranted) {
      Notification.requestPermission(permission => {
        if (NOTIFICATION_PERMISSIONS.DENIED === permission) {
          setValue(false);
        }

        if (permission === NOTIFICATION_PERMISSIONS.GRANTED) {
          postMessage({
            type: POST_MESSAGES.SUBSCRIBE_NOTIFICATIONS
          });
        }
      });
    } else if (value && !isNotificationsGranted) {
      postMessage({
        type: POST_MESSAGES.UNSUBSCRIBE_NOTIFICATIONS
      });
    }

    setValue(isNotificationsGranted);
  };

  useEffect(() => {
    cleanupSubscriptions(() => {
      setValue(false);
    });
  }, []);

  return (
    <>
      {/* {value ? <NotificationsIcon /> : <NotificationsOffIcon />} */}
      <FormControlLabel
        disabled={notificationsNotSupported}
        value="top"
        checked={value}
        control={<Switch color="primary" />}
        label={
          <div className={css.root}>
            {value ? <NotificationsIcon className={css.on} /> : <NotificationsOffIcon className={css.off} />}
            <div>{i18n.t("buttons.enable_webpush")}</div>
          </div>
        }
        onChange={handleSwitch}
        labelPlacement="start"
        start
      />
    </>
  );
}

Component.displayName = "PushNotificationsToggle";

export default Component;
