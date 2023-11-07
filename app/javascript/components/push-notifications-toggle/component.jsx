// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FormControlLabel, Switch } from "@material-ui/core";
import { useEffect, useState } from "react";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useDispatch } from "react-redux";

import { NOTIFICATION_PERMISSIONS, POST_MESSAGES } from "../../config";
import { cleanupSubscriptions } from "../../libs/service-worker-utils";
import { useI18n } from "../i18n";
import ActionDialog, { useDialog } from "../action-dialog";
import { useMemoizedSelector } from "../../libs";
import { getWebpushConfig } from "../application/selectors";
import {
  getNotificationSubscription,
  getUserProperty,
  removeNotificationSubscription,
  saveNotificationSubscription
} from "../user";
import ConditionalTooltip from "../conditional-tooltip";
import { enqueueSnackbar } from "../notifier";

import css from "./styles.css";

const DIALOG = "PUSH_NOTIFICATIONS";

function Component() {
  const dispatch = useDispatch();

  const webpushConfig = useMemoizedSelector(state => getWebpushConfig(state));
  const notificationEndpoint = useMemoizedSelector(state => getNotificationSubscription(state));
  const receiveWebpush = useMemoizedSelector(state => getUserProperty(state, "receiveWebpush"));
  const userLoaded = useMemoizedSelector(state => getUserProperty(state, "loaded"));
  const [value, setValue] = useState(false);

  const vapidID = webpushConfig.get("vapid_public");
  const i18n = useI18n();
  const { dialogOpen, setDialog } = useDialog(DIALOG);

  const notificationsNotSupported = !("Notification" in window) || !receiveWebpush;
  const notificationsDenied = () => Notification.permission === NOTIFICATION_PERMISSIONS.DENIED;

  useEffect(async () => {
    setValue(await Boolean(notificationEndpoint));
  }, []);

  const handleSwitch = opened => event => {
    const checked = event?.target?.checked;

    if (!checked && value) {
      postMessage(
        {
          type: POST_MESSAGES.UNSUBSCRIBE_NOTIFICATIONS
        },
        window.origin
      );

      setValue(false);
      setDialog({ dialog: DIALOG, open: false });
    } else {
      if (opened) {
        setValue(true);
        setDialog({ dialog: DIALOG, open: opened });
      }

      if (
        !opened &&
        [NOTIFICATION_PERMISSIONS.DEFAULT, NOTIFICATION_PERMISSIONS.DENIED].includes(Notification.permission)
      ) {
        setDialog({ dialog: DIALOG, open: false });
        setValue(false);
      }
    }
  };

  const handleSuccess = () => {
    Notification.requestPermission(permission => {
      if (NOTIFICATION_PERMISSIONS.DENIED === permission) {
        setValue(false);
      }

      if (permission === NOTIFICATION_PERMISSIONS.GRANTED) {
        postMessage(
          {
            type: POST_MESSAGES.SUBSCRIBE_NOTIFICATIONS
          },
          window.origin
        );
        setValue(true);
      }

      setDialog({ dialog: DIALOG, open: false });
    });
  };

  const handleMessage = event => {
    if (event?.data?.type === POST_MESSAGES.DISPATCH_REMOVE_SUBSCRIPTION) {
      dispatch(removeNotificationSubscription());
    }

    if (event?.data?.type === POST_MESSAGES.DISPATCH_SAVE_SUBSCRIPTION) {
      dispatch(saveNotificationSubscription(event?.data?.endpoint));
    }

    if (event?.data?.type === POST_MESSAGES.ATTEMPTS_SUBSCRIPTION_FAILED) {
      setValue(false);
      dispatch(enqueueSnackbar("Attempts subscription failed"));
    }
  };

  useEffect(() => {
    cleanupSubscriptions(() => {
      setValue(false);
    });

    window.addEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    window.vpubID = vapidID;
  }, [vapidID]);

  useEffect(() => {
    if (!receiveWebpush && userLoaded) {
      setValue(false);
    }
  }, [receiveWebpush]);

  const pauseAfterDays = Math.floor(webpushConfig.get("pause_after") / 1440);

  if (!webpushConfig.get("enabled", false)) {
    return false;
  }

  return (
    <ConditionalTooltip condition={!receiveWebpush} title={i18n.t("user.receive_webpush.tooltip")}>
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
        onChange={handleSwitch(true)}
        labelPlacement="start"
        start
      />
      <ActionDialog
        open={dialogOpen}
        onClose={handleSwitch(false)}
        cancelHandler={handleSwitch(false)}
        successHandler={handleSuccess}
        showSuccessButton={!notificationsDenied()}
        confirmButtonLabel={i18n.t("buttons.dialog_yes")}
        dialogTitle={i18n.t("push_notifications_dialog.title")}
      >
        {notificationsDenied() ? (
          <div className={css.blocked_copy}>
            <div>{i18n.t("push_notifications_dialog.body_blocked.message")}</div>
            <div>{i18n.t("push_notifications_dialog.body_blocked.android")}</div>
            <div>{i18n.t("push_notifications_dialog.body_blocked.ios")}</div>
          </div>
        ) : (
          i18n.t("push_notifications_dialog.body", { count: pauseAfterDays })
        )}
      </ActionDialog>
    </ConditionalTooltip>
  );
}

Component.displayName = "PushNotificationsToggle";

export default Component;
